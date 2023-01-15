
const { login_schema, registration_schema, reset_password_schema } = require("../models/users");
const validate = require("../middlewares/validate");
const express = require("express");

const { 
    login, 
    register_user, 
    reset_password,
} = require("../controllers/auth");

const router = express.Router();

router.post("/login", validate(login_schema), login);
router.post("/register", validate(registration_schema), register_user);
router.put("/resetpassword", validate(reset_password_schema),reset_password);

module.exports = router;