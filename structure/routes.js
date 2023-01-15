

const express = require("express");
const auth = require("../routes/auth");
const posts = require("../routes/posts");
const search = require("../routes/search");
const users = require("../routes/users");

module.exports = (app) => {
    app.use(express.json());
    app.use("/api/auth", auth);
    app.use("/api/posts", posts);
    app.use("/api/search", search);
    app.use("/api/users", users);
}