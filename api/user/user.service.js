const User = require('./user');
const httpStatus = require("http-status");
const ApiError = require("../../utils/ApiError");

const { ObjectId } = require('mongoose').Types

const logger = require('../../config/logger');

async function getUserByEmailOrUsername({ email, username }) {
    const condition = [];

    if(email) {
        condition.push({email});
    }

    if(username) {
        condition.push({username});
    }

    return User.findOne({ $or: condition})
}

async function listUserQuery(){
    return User.find();
}

async function getUsersByIds(ids) {
    try {
        const objectIds = ids.map(id => new ObjectId(id));

        const users = await User.find({ _id: { $in : objectIds}});

        return users;
    }
    catch(err){
        logger.info(`[getUsersByIds] Fetching users failed: ${err}`);
        throw new ApiError(httpStatus.status.INTERNAL_SERVER_ERROR, "Error fetching users by ids");
    }
}

async function getUsersById(id) {
    return User.findById(id);
}

async function followUserAndUpdate({ followerUser, followingUser}) {
    if(!(followerUser instanceof User) || !(followingUser instanceof User)) {
        logger.error(`[follow] user instances are not correct`);
        throw new ApiError(httpStatus.status.BAD_REQUEST, 'Error in the follow process');
    }

    if(!followingUser.followers?.includes(followerUser?.id)) {
        await followingUser.updateOne({ $push : {followers: followerUser?.id }})
    }

    if(!followerUser.followings?.includes(followingUser?.id)) {
        await followerUser.updateOne({ $push: {followings: followingUser?.id }});
    }
}

async function unfollowUserAndUpdate({ followerUser, followingUser}) {
    if(!(followerUser instanceof User) || !(followingUser instanceof User)) {
        logger.error(`[follow] user instances are not correct`);
        throw new ApiError(httpStatus.status.BAD_REQUEST, 'Error in the follow process');
    }

    if(followingUser.followers?.includes(followerUser?.id)) {
        await followingUser.updateOne({ $pull : {followers: followerUser?.id }})
    }

    if(followerUser.followings?.includes(followingUser?.id)) {
        await followerUser.updateOne({ $pull: {followings: followingUser?.id }});
    }
}

module.exports = { getUserByEmailOrUsername, listUserQuery, getUsersByIds, getUsersById, followUserAndUpdate, unfollowUserAndUpdate }