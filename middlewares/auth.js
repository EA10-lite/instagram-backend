
const config = require("config");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const token = req.header('cookie');
    if(!token.slice(6)) return res.status(401).send({ error: "Access Denied: No JWT provdide." });

    try {
        const result = jwt.verify(token.slice(6), process.env.JWT_PRIVATE_KEY);
        req.user = result;
        
        next();
    } catch (error) {
        res.status(401).send({ error: "Access Denied: You are not Authenticated" });
    }
};