
const { login_schema, registration_schema, reset_password_schema } = require("../models/users");
const { follow_validation_schema } = require("../models/follow");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const express = require("express");

const { 
    follow_user,
    get_user_details,
    suggest_friends, 
    unfollow_user,
} = require("../controllers/user");

const router = express.Router();

router.get("/me", auth, get_user_details);
router.get("/suggestion", auth, suggest_friends);
router.put("/follow", [ auth, validate(follow_validation_schema)], follow_user);
router.put("/unfollow", [ auth, validate(follow_validation_schema)], unfollow_user);

module.exports = router;