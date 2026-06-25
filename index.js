require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const {authMiddleware} = require("./middleware");
const {userModel, orgModel, boardModel, issueModel} = require("./models");

const app = express();

app.use(express.json());


app.post("/signup", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const userExists = await userModel.findOne({
        username: username
    });

    if(userExists){
        return res.status(403).json({
            message: "User already exists"
        });
    }

    const newUser = await userModel.create({
        username: username,
        password: password
    });

    res.json({
        id: newUser._id
    });

});

app.post("/signin", async (req, res)=>{
    const username = req.body.username;
    const password = req.body.password;

    const userExists = await userModel.findOne({
        username: username,
        password: password
    })

    if(!userExists){
        return res.status(403).json({
            message: "User have signed up"
        });
    }

    const token = jwt.sign({
        userId: userExists._id
    }, process.env.JWT_SECRET);

    res.json({
        token: token
    });

});

app.post("/organization", authMiddleware, async (req, res)=>{
    const userId = req.userId;

    const newOrg = await orgModel.create({
        title: req.body.title,
        description: req.body.description,
        admin: userId,
        members: []
    });    

    res.json({
        message: "Org created",
        id: newOrg._id
    });
});

app.post("/add_member_to_organization", authMiddleware, async (req, res)=>{
    const userId = req.userId;
    const organizationId = req.body.organizationId;
    const memberUsername = req.body.memberUsername;

    const orgExists = await orgModel.findOne({
        _id: organizationId
    });

    if(!orgExists || orgExists.admin.toString() !== userId.toString()){
        return res.status(403).json({
            message: "Either the org does'nt exist or you are not an admin of this org"
        });
    }

    const user = await userModel.findOne({
        username: memberUsername
    });

    if(!user){
        return res.status(403).json({
            message: "No user with this username exists in DB"
        });
    }

    const memberExists = orgExists.members.some(
        m => m.toString() === user._id.toString()
    );

    if(memberExists){
        return res.status(405).json({
            message: "Member already exists in this organization"
        });
    }

    await orgModel.updateOne({
        _id: organizationId
    },{
        $push:{
            "members": user._id
        }
    });

    res.json({
        message: "New member added"
    });

});

app.post("/board", authMiddleware, async (req, res)=>{
    const userId = req.userId;
    const title = req.body.title;
    const organizationId = req.body.organizationId;

    const organization = await orgModel.findOne({
        _id: organizationId
    });

    if(!organization || organization.admin.toString() !== userId){
        return res.status(403).json({
            message: "Either this organization doesnt exists or you are not the admin of the organization"
        });
    }

    const newBoard = await boardModel.create({
        title: title,
        orgId: organizationId
    });

    res.json({
        message: "New board created"
    });
});

app.post("/issue", authMiddleware, async (req, res)=>{
    const userId = req.userId;
    const title = req.body.title;
    const boardId = req.body.boardId;

    const board = await boardModel.findOne({
        _id: boardId
    });

    const orgId = board.orgId;

    const org = await orgModel.findOne({
        _id: orgId
    });

    if(!org || org.admin.toString() !== userId){
        return res.status(403).json({
            message: "Either this organization doesnt exist or ur not admin"
        });
    }

    if(!board){
        return res.status(403).json({
            message: "This board doesnt exist"
        });
    }

    const newIssue = await issueModel.create({
        title: title,
        boardId: boardId
    });

    res.json({
        id: newIssue._id
    })

});

app.get("/boards", authMiddleware, async (req, res)=>{
    const userId = req.userId;
    const organizationId = req.query.organizationId;

    const organization = await orgModel.findOne({
        _id: organizationId
    });

    if(!organization){
        return res.status(403).json({
            message: "The organization doesnt exists"
        });
    }

    const isMember = organization.members.some(
        m => m.toString() === userId.toString()
    );

    if (!isMember && organization.admin.toString() !== userId.toString()){
        return res.status(403).json({
            message: "You are not a member of this organization"
        });
    }

    const boards = await boardModel.find({
        orgId: organizationId
    });

    res.json({
        boards: boards
    });

});

app.get("/issues", (req, res)=>{

});

app.get("/members", authMiddleware, async (req, res)=>{
    const userId = req.userId;
    const organizationId = req.query.orgId;

    const organization = await orgModel.findOne({
        _id: organizationId
    });

    if (!organization) {
        return res.status(403).json({
            message: "Organization doesn't exist"
        });
    }

    const isMember = organization.members.some(
        m => m.toString() === userId.toString()
    );

    const isAdmin =
        organization.admin.toString() === userId.toString();

    if (!isAdmin && !isMember) {
        return res.status(403).json({
            message: "You're not part of this organization"
        });
    }

    res.json({
        admin: organization.admin,
        members: organization.members
    })

});

app.get("/organization", authMiddleware, async (req, res)=>{
    const userId = req.userId;
    const organizationId = req.query.organizationId;

    const organization = await orgModel.findOne({
        _id: organizationId
    });

    if(!organization || organization.admin.toString() !== userId.toString()){
        return res.status(403).json({
            message: "Either the org does'nt exist or you are not an admin of this org"
        });
    }

    res.json({
        organization: organization
    });
});

app.put("/issues", (req, res)=>{

});

app.delete("/members", authMiddleware, async (req, res) =>{
    const userId = req.userId;
    const organizationId = req.body.organizationId;
    const memberUsername = req.body.memberUsername;

    const organization = await orgModel.findOne({
        _id: organizationId
    });

    if(!organization || organization.admin.toString() != userId.toString()){
        return res.status(403).json({
            message: "Either the org does'nt exist or you are not an admin of this org"
        });
    }

    const user = await userModel.findOne({
        username: memberUsername
    })

    if(!user){
        return res.status(403).json({
            message: "No user with this username exists in DB"
        });
    }

    const userExists = organization.members.some(
        m => m.toString() === user._id.toString()
    );

    if(!userExists){
        return res.status(403).json({
            message: "Member doesnt exist in the organization"
        });
    }

    await orgModel.updateOne({
        _id: organizationId
    },{
        "$pullAll":{
            members: [user._id]
        }
    })

    res.json({
        message: "Member deleted from the org"
    });
});

app.listen(3000);