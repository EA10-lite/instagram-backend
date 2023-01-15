
const Joi = require("joi");
const mongoose = require("mongoose");

const like_validation_schema = {
    postId: Joi.objectId().required(),
}

const likes_schema = new mongoose.Schema({
    likedBy: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
});

module.exports.likes_schema = likes_schema;
module.exports.like_validation_schema = like_validation_schema;