require("dotenv").config();
const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next){
    const token = req.headers.token;

    if(!token){
        return res.status(403).json({
            message: "You have not logged in"
        });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    if(!userId){
        return res.status(403).json({
            message: "Malformed Token"
        });
    }

    req.userId = userId;

    next();

}

module.exports = {
    authMiddleware
}