
const { User } = require("../models/users");
const { Post } = require("../models/posts");
const async_middlware = require("../middlewares/async");

const search = async_middlware(async (req, res, next) => {
    const { search } = req.query;
    // const posts = await Post.find({ caption: { $regex: query, $options: "i" }});

    let regex = new RegExp(`^[${search}0-9._-]+$`);
    const users = await User
        .find()
        .or([{ name: { $regex: search , $options : "i" }}, { username: {  $regex: search, $options : "i" }}])
        .select('avatar username')

    const posts = await Post
        .find()
        .or([{ caption: { $regex: search , $options : "i" }}, { 'postedBy.username': {  $regex: search, $options : "i" }}])
        .select('avatar username')

    res.status(200).send({
        data: {
            posts: posts,
            users: users
        },
        error: null
    });
});

 module.exports = {
    search
}