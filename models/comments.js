
const Joi = require("joi");
const mongoose = require("mongoose");

const comment_validation_schema = {
    comment: Joi.string().min(1).max(1024).required(),
    postId: Joi.objectId().required(),
}

const comment_schema = new mongoose.Schema({
    createdAt: { type: Date, default: Date.now },
    comment: { type: String, minLength: 1, maxLength: 1024, required: true },
    commentBy: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
});

module.exports.comment_schema = comment_schema;
module.exports.comment_validation_schema = comment_validation_schema;