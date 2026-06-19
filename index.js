const express = require("express");
const jwt = require("jsonwebtoken");
const {authMiddleware} = require("./middleware");

const app = express();

app.use(express.json());

let USERS_ID = 1;
let ORGANIZATION_ID = 1;
let BOARD_ID = 1;
let ISSUE_ID = 1; 

const USERS = [];
const ORGANIZATION = [];
const BOARDS = [];
const ISSUES = [];

app.post("/signup", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const userExists = USERS.find( user => user.username === username);

    if(userExists){
        return res.status(403).json({
            message: "User already exists"
        });
    }

    USERS.push({
        username: username,
        password: password,
        id : USERS_ID++
    });

    res.json({
        message: "You have signed up"
    });

});

app.post("/signin", (req, res)=>{
    const username = req.body.username;
    const password = req.body.password;

    const userExists = USERS.find(user => user.username === username && user.password === password);

    if(!userExists){
        return res.status(403).json({
            message: "User have signed up"
        });
    }

    const token = jwt.sign({
        userId: userExists.id
    },"token");

    res.json({
        token: token
    });

});

app.post("/organization", authMiddleware, (req, res)=>{
    const userId = req.userId;
    ORGANIZATION.push({
        id: ORGANIZATION_ID++,
        title: req.body.title,
        description: req.body.des,
        admin: userId,
        members: []
    })

    res.json({
        message: "Org created",
        id: ORGANIZATION_ID - 1 
    });
});

app.post("/add_member_to_organization", authMiddleware, (req, res)=>{
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