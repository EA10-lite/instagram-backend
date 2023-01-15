
const { User } = require("../models/users");
const async_middleware = require("../middlewares/async");
const { hash_password, compare_password } = require("../utils/hash");
const cookie = require("cookie");

const login = async_middleware(async (req, res) => {
    let user = await User
        .findOne()
        .or([{ email: req.body.name }, { username: req.body.name }])
    if(!user) return res.status(400).send({ error: "invalid email or password" });

    const is_valid_password = await compare_password(req.body.password, user.password);
    if(!is_valid_password) return res.status(400).send({ error: "incorrect email or password" });

    const token = user.generateAuthToken();

    res.status(201).send({
        data: token,
        error: null,
        message: "login successful."
    });
});

const register_user = async_middleware(async (req, res) => {
    let user = await User.findOne({ email: req.body.email, username: req.body.username });
    if(user) return res.status(400).send({ error: "user already exist with the email or username." });

    user = new User({...req.body });
    user.password = await hash_password(user.password);
    await user.save();

    const token = user.generateAuthToken();

    res.header('x-auth-token', token).status(201).send({
        data: _.pick(user, ['name', 'username', 'avatar', '_id']),
        error: null,
        message: "registration successful."
    });
});

const reset_password = async_middleware(async (req, res) => {
    let user = await User.findOne({ email: req.body.email });
    if(!user) return res.status(400).send({ error: "invalid email or passowrd" });

    user.password = await hash_password(req.body.password);
    await user.save();

    res.status(200).send({
        error: null,
        message: "password reset successful."
    });
});


module.exports = {
    login,
    register_user,
    reset_password,
}