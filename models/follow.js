
const Joi = require("joi");
const mongoose = require("mongoose");

const follow_validation_schema = {
    userId: Joi.objectId().required(),
}

const follow_schema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, ref: "User", required: true }
});

module.exports.follow_schema = follow_schema;
module.exports.follow_validation_schema = follow_validation_schema;