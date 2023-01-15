
const mongoose = require("mongoose");
const logger = require("../middlewares/logger");

module.exports = () => {
    mongoose.connect("mongodb://localhost/instagram")
        .then(()=> logger.info("connecting to mongodb"))
}