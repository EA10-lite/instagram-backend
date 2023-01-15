
const { comment_validation_schema } = require("../models/comments");
const { like_validation_schema } = require("../models/likes");
const { post_validation_schema } = require("../models/posts");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const express = require("express");
const { 
    add_comment, 
    create_post, 
    delete_post, 
    get_post, 
    get_more_posts,
    get_posts, 
    like_post, 
    unlike_post
} = require("../controllers/post");

const router = express.Router();

router.get("/", get_posts);
router.get("/explore", get_more_posts);
router.get("/:id", get_post);
router.post("/", [auth, validate(post_validation_schema)], create_post );
router.put("/comments/add", [auth, validate(comment_validation_schema)], add_comment);
router.put("/likes/add", [auth, validate(like_validation_schema)], like_post);
router.put("/likes/remove", [auth, validate(like_validation_schema)], unlike_post);
router.delete("/:id", auth, delete_post);

module.exports = router;