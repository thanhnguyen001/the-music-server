const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
    try {   
        const token = req.headers.authorization.split(" ")[1].replace(/"/, "");
        if (!token) {
            res.json({ success: false, message: "Not found token!"});
            return;
        }
        // console.log(token);
        const decoded = jwt.verify(token, process.env.SECRET_JWT);
        req.userId = decoded.userId;
        
        next();
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

module.exports = verifyToken;