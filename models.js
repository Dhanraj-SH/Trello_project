const mongoose = require("mongoose");

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
const orgModel = mongoose.model("organization", orgSchema);

module.exports = {
    userModel,
    orgModel
}