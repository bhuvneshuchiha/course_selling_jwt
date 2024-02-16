const JWT_SECRET = require("..");
const jwt = require("jsonwebtoken")

function userMiddleware(req, res, next) {
    const token = req.headers.authorization;
    const words = token.split(" ");
    const jwtToken = words[-1];
    const decodedValue = jwt.verify(jwtToken, JWT_SECRET)
    req.username = decodedValue.username;
    if(decodedValue.username){
        next();
    }else{
        res.status(403).json({
            message : "You are not authorized."
        })
    }
}

module.exports = userMiddleware;