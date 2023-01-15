
const { Post  } = require("../models/posts");
const { User } = require("../models/users");
const async_middleware = require("../middlewares/async");
const _ = require("lodash");

const get_post = async_middleware(async (req, res) => {
    const post = await Post
        .findById(req.params.id)
        .populate('postedBy', 'avatar username')
        .populate('comments.commentBy', 'avatar username')
        .populate('likes.likedBy', 'avatar username');
    if(!post) return res.status(404).send({ error: "post you are looking for does not exist." });

    res.status(200).send({
        data: post,
        error: null
    });
});

const get_posts = async_middleware(async (req, res) => {
    const posts = await Post
        .find()
        .populate('postedBy', 'avatar username')
        .populate('comments.commentBy', 'avatar username')
        .populate('likes.likedBy', 'avatar username')
        .select('createdAt caption likes comments media postedBy')

    res.status(200).send({
        data: posts,
        error: null
    });
});

const get_more_posts = async_middleware(async (req, res) => {
    const posts = await Post.aggregate([{ $sample: { size: 100 }}])

    res.status(200).send({
        data: posts,
        error: null
    });
});

const create_post = async_middleware(async (req, res) => {
    const user = await User.findById(req.user._id);
    if(!user) return res.status(400).send({ error: "You have to be logged in" });

    const post = new Post({
        ...req.body,
        postedBy: user._id
    });
    await post.save();

    res.status(201).send({
        data: _.pick(post, ['postedBy', 'media', 'caption']),
        error: null,
        message: "post created."
    })
});

const add_comment = async_middleware(async (req, res) => {
    const user = await User.findById(req.user._id);
    if(!user) return res.status(400).send({ error: "invalid request!" });

    const post = await Post.findById(req.body.postId);
    if(!post) return res.status(404).send({ error: "post not found." });

    post.comments.push({ createdAt: Date.now() , comment: req.body.comment, commentBy: req.user._id });
    await post.save();

    res.status(200).send({
        data: post,
        error: null,
        message: "you added a comment."
    });
});

const like_post = async_middleware(async (req, res) => {
    const user = await User.findById(req.user._id);
    if(!user) return res.status(400).send({ error: "invalid request" });

    const post = await Post.findById(req.body.postId);
    if(!post) return res.status(404).send({ error: "post not found." });

    // if the user already likes the post, then stop request and return no content
    const is_liked_post = post.likes.find(post => user._id.equals(post.likedBy));
    if(is_liked_post) return res.status(204).send();

    post.likes.push({ likedBy: req.user._id });
    await post.save();

    res.status(200).send({
        data: post,
        error: null,
        message: "you like this post."
    });
});

const unlike_post = async_middleware(async (req, res) => {
    const user = await User.findById(req.user._id);
    if(!user) return res.status(400).send({ error: "invalid request" });

    const post = await Post.findById(req.body.postId);
    if(!post) return res.status(404).send({ error: "post not found." });

    // check if the user has liked the post, 
    const like = post.likes.find(like => user._id.equals(like.likedBy));
    if(!like) return res.status(400).send({ error: "you cannot carry out this request."});
    
    post.likes.splice(post.likes.indexOf(like), 1);
    await post.save();

    res.status(200).send({
        data: post,
        error: null,
        message: "you unliked this post."
    });
});

const delete_post = async_middleware(async (req, res) => {
    // check if the post the user is trying to delete is created by the user
    const post = await Post.findOneAndRemove({ _id: req.params.id, postedBy: req.user._id });
    if(!post) return res.status(400).send({ error: "Post not found!" });

    res.status(200).send({
        data: post,
        error: null,
        message: "post deleted successfully!"
    });
});

module.exports = {
    get_more_posts,
    get_post,
    get_posts,
    create_post,
    delete_post,
    add_comment,
    like_post,
    unlike_post
};
