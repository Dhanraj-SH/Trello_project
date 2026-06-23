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

const userModel = mongoose.model("users", userSchema);
const orgModel = mongoose.model("organizations", orgSchema);

module.exports = {
    userModel,
    orgModel
}