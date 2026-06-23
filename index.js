const express = require("express");
const jwt = require("jsonwebtoken");
const {authMiddleware} = require("./middleware");
const {userModel, orgModel} = require("./models");

const app = express();

app.use(express.json());

let BOARD_ID = 1;
let ISSUE_ID = 1; 

const BOARDS = [];
const ISSUES = [];

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
    },"token");

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

    if(!orgExists || orgExists.admin !== userId){
        return res.status(403).json({
            message: "Either the org does'nt exist or you are not an admin of this org"
        });
    }

    const user = userModel.findOne({
        username: memberUsername
    });

    if(!user){
        return res.status(403).json({
            message: "No user with this username exists in DB"
        });
    }

    const userExists = organization.members.includes(user.id);

    if(userExists){
        return res.status(403).json({
            message: "Member already exits in this organization"
        })
    }else{
        organization.members.push(user.id);
        res.json({
            message: "New member added to org"
        });
    } 
});

app.post("/board", (req, res)=>{
    
});

app.post("/issue", (req, res)=>{

});

app.get("/boards", (req, res)=>{

});

app.get("/issues", (req, res)=>{

});

app.get("/members", (req, res)=>{

});

app.get("/organization", authMiddleware, (req, res)=>{
    const userId = req.userId;
    const organizationId = parseInt(req.query.organizationId);

    const organization = ORGANIZATION.find(org => org.id === organizationId);

    if(!organization || organization.admin !== userId){
        return res.status(403).json({
            message: "Either the org does'nt exist or you are not an admin of this org"
        })
    }

    res.json({
        organization: {
            ...organization,
            members: organization.members.map(memberId => {
                const user = USERS.find(user => user.id === memberId);
                return {
                    id: user.id,
                    username: user.username
                }
            })
        }
    });
});

app.put("/issues", (req, res)=>{

});

app.delete("/members", authMiddleware, (req, res)=>{
    const userId = req.userId;
    const organizationId = req.body.organizationId;
    const memberUsername = req.body.memberUsername;

    const organization = ORGANIZATION.find(org => org.id === organizationId);

    if(!organization || organization.admin != userId){
        return res.status(403).json({
            message: "Either the org does'nt exist or you are not an admin of this org"
        });
    }

    const user = USERS.find(users => users.username === memberUsername);

    if(!user){
        return res.status(403).json({
            message: "No user with this username exists in DB"
        });
    }

    const userExists = organization.members.includes(user.id);

    if(!userExists){
        return res.status(403).json({
            message: "Member has been already removed from the organization"
        })
    }

    organization.members = organization.members.filter(memberId => memberId !== user.id);

    res.json({
        message: "Member deleted from the org"
    });
});

app.listen(3000);