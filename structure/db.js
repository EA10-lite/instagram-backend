
const mongoose = require("mongoose");
const logger = require("../middlewares/logger");

module.exports = () => {
    mongoose.connect("mongodb://localhost/instagram", { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
        .then(()=> logger.info("connecting to mongodb"))
}