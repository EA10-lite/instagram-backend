
const { login_schema, registration_schema } = require("../models/users");
const validate = require("../middlewares/validate");
const express = require("express");

const { 
    login, 
    register_user, 
} = require("../controllers/auth");

const router = express.Router();

router.post("/login", validate(login_schema), login);
router.post("/register", validate(registration_schema), register_user);

module.exports = router;