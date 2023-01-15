
const Joi = require("joi");
const mongoose = require("mongoose");
const { comment_schema } = require("./comments");
const { likes_schema } = require("./likes");

const post_validation_schema = {
    caption: Joi.string().min(1).max(1024),
    location: Joi.string().min(5).max(50),
    media: Joi.array().items(Joi.object().keys({
        url: Joi.string().uri().required(),
        type: Joi.string().required()
    })).min(1).max(10).required(),
};

const post = new mongoose.Schema({
    createdAt: { type: Date, default: Date.now },
    caption: { type: String, minLength: 1, maxLength: 1024 },
    comments: [ comment_schema ],
    likes: [{ type: likes_schema, unique: true }],
    location: { type: String, minLength: 5, maxLength: 50 },
    media: [{ type: { type: String, required: true }, url: { type: String, required: true } }],
    postedBy: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
});

const Post = mongoose.model("Post", post);

module.exports.Post = Post;
module.exports.post_validation_schema = post_validation_schema;