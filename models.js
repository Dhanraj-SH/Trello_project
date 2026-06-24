require("dotenv").config();
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL);

const userSchema = mongoose.Schema({
    username:{
        type: String,
        unique: true
    },
    password: String
});

const orgSchema = mongoose.Schema({
    title: String,
    description: String,
    admin: mongoose.Types.ObjectId,
    members: [mongoose.Types.ObjectId]
});

const boardSchema = mongoose.Schema({
    title: String,
    orgId: mongoose.Types.ObjectId
});

const issuesSchema = mongoose.Schema({
    title: String,
    boardId: mongoose.Types.ObjectId
});

const userModel = mongoose.model("users", userSchema);
const orgModel = mongoose.model("organizations", orgSchema);
const boardModel = mongoose.model("boards", boardSchema);
const issueModel = mongoose.model("issues", issuesSchema);


module.exports = {
    userModel,
    orgModel,
    boardModel,
    issueModel
}