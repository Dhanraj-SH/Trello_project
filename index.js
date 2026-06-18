const express = require("express");
const jwt = require("jsonwebtoken");

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
        userID: userExists.id
    },"token");

    res.json({
        token: token
    });

});

app.post("/organization", (req, res)=>{

});

app.post("/add_member_to_organization", (req, res)=>{

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

app.put("/issues", (req, res)=>{

});

app.delete("/signup", (req, res)=>{

});

app.listen(3000);