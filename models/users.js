
const Joi = require("joi");
const config = require("config");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { follow_schema } = require("./follow");

const registration_schema = {
    avatar: Joi.string().uri().required(),
    email: Joi.string().email().min(5).max(50).required(),
    name: Joi.string().min(5).max(50).required(),
    password: Joi.string().min(8).max(255).required(),
    username: Joi.string().min(3).max(50).required(),
};

const login_schema = {
    name: Joi.string().email().min(5).max(50).required(),
    password: Joi.string().min(8).max(255).required(),
}

const reset_password_schema = {
    email: Joi.string().email().min(5).max(50).required(),
    password: Joi.string().min(8).max(255).required(),
    confirm_password: Joi.any().equal(Joi.ref('password')).required(),
}

const user = new mongoose.Schema({
    avatar: { type: String, minLength: 5, maxLength: 255, required: true },
    email: { type: String, minLength: 5, maxLength: 50, required: true, unique: true },
    name: { type: String, minLength: 5, maxLength: 50, required: true, },
    password: { type: String, minLength: 8, maxLength: 1024, required: true },
    username: { type: String, minLength: 3, maxLength: 50, required: true, unique: true },

    followers: [follow_schema],
    following: [follow_schema]
});

user.methods.generateAuthToken = function(){
    return jwt.sign({ _id: this._id, username: this.username, avatar: this.avatar }, config.get("jwtPrivateKey"))
};

const User = mongoose.model("User", user);

exports.login_schema = login_schema;
exports.registration_schema = registration_schema;
exports.reset_password_schema = reset_password_schema;
exports.User = User;