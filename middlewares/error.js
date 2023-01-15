const logger = require("./logger");

module.exports = (err, req, res, next) => {
    // log the error
    logger.error(err.message);
    
    res.status(500).send({ error: "something failed." });
}