
const { User } = require("../models/users");
const async_middleware = require("../middlewares/async");

const _ = require("lodash");
const mongoose = require("mongoose");

const get_user_details  = async_middleware(async (req, res) => {
    const user = await User.findById(req.user._id);
    if(!user) return res.status(404).send({ error: "user not found." });

    res.status(200).send({
        data: _.pick(user, ['name', 'username', 'avatar', '_id']),
        error: null
    });
});

const follow_user = async (req, res) => {
    const session = await mongoose.startSession();
    
    const transactionOptions = {
        readPreference: 'primary',
        readConcern: { level: 'local' },
        writeConcern: { w: 'majority' }
      };

    session.startTransaction(transactionOptions);

    try {
        // First find the user who's trying to consume this API - user1,
        // if user1 does not exist, return an error message,
        const user1 = await User.findById(req.user._id);
        if(!user1) return res.status(400).send({ error: "Invalid Request - User does not exist." });
        if(user1._id.equals(req.body.userId)) return res.status(400).send({ error: "Invalid Request: you cannot follow yourself." });

        // Then find the account to be followed - user2,
        // if user2 does not exist, return an error message.
        const user2 = await User.findById(req.body.userId);
        if(!user2) return res.status(404).send({ error: "user does not exist." })

        // verify if user1 is already following user2,
        // if user1 is already following user2, return an error
        const is_following = user1.following.find(following => following.userId.equals(req.body.userId));
        if(is_following) return res.status(400).send({ error: "Invalid request - user already follows this account" });

        // user1.following.addToSet({ userId: user2._id }, { session });
        // user2.followers.addToSet({ userId: user1._id }, { session });

        await User.updateOne({ _id: user1._id }, { $addToSet: { following: { userId: user2._id }}}, { session });
        await User.updateOne({ _id: user2._id }, { $addToSet: { followers: { userId: user1._id }}}, { session });

        await session.commitTransaction();
        await session.endSession();

        res.status(200).send({
            error: null,
            message: `You are now following ${user2.username}`
        });
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        res.status(400).send({ error: error.message });
    }
}

const unfollow_user = async (req, res) => {
    const session = await mongoose.startSession();
    
    const transactionOptions = {
        readPreference: 'primary',
        readConcern: { level: 'local' },
        writeConcern: { w: 'majority' }
      };

    session.startTransaction(transactionOptions);

    try {

        // First find the user who's trying to consume this API - user1,
        // if user1 does not exist, terminate the request,
        const user1 = await User.findById(req.user._id);
        if(!user1) return res.status(400).send({ error: "Invalid Request - User does not exist." });
        if(user1._id.equals(req.body.userId)) return res.status(400).send({ error: "Invalid Request: you cannot follow yourself." });

        // Then find the account to be followed - user2,
        // if the user2 does not exist, terminate the request.
        const user2 = await User.findById(req.body.userId)
        if(!user2) return res.status(404).send({ error: "user does not exist." })

        // verify if user1 is following user2,
        // if user1 is not following user2, stop the request with no action to be carried out
        const is_following = user1.following.find(following => following.userId.equals(req.body.userId));
        if(!is_following) return res.status(400).send({ error: "you are not following this user" });

        // 
        const follower = user2.followers.find(follower => follower.userId.equals(user1._id)); 
        if(!follower) return res.status(400).send({ error: ""});


        await User.updateOne({ _id: user1._id }, { $pull : { following : { userId: user2._id }}},  { session });
        await User.updateOne({ _id: user2._id }, { $pull : { followers : { userId: user1._id }}},  { session });
        
        await session.commitTransaction();
        await session.endSession();

        res.status(200).send({
            error: null,
            message: `You unfollowed ${user2.username}`
        });
        
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        res.status(400).send({ error: error.message });
    }
};

const suggest_friends = async_middleware(async (req, res) => {
    const users = await User.find();
    const user = await User.findById(req.user._id);
    if(!user) return res.status(400).send({ error: "bad request!" });

    const suggestions = [];
    // loop through all the users queried from the database,
    for(let i = 0; i < users.length; i++){
        // check if the current user in the loop is not the user who sends the request,
        // of the the user is not following the current user
        if(!user.following.find(following => following._id.equals(users[i]._id)) && !user._id.equals(users[i]._id)){
            suggestions.push({
                _id: users[i]._id,
                avatar: users[i].avatar,
                username: users[i].username
            });
        }
    }
    res.status(200).send({
        data: suggestions,
        error: null
    });
});

module.exports = {
    follow_user,
    get_user_details,
    suggest_friends,
    unfollow_user,
}