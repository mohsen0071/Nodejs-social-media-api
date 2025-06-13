const httpStatus = require("http-status");
const ApiError = require("../../utils/ApiError");

const User = require("./user");
const genericResponse = require('../../utils/genericResponse');
const logger = require('../../config/logger');
const { getUserByEmailOrUsername, listUserQuery, getUsersByIds, getUsersById, followUserAndUpdate, unfollowUserAndUpdate } = require('./user.service')

async function login(req, res, next) {
    const payload = req.body;

    try {
        let { email, password } = payload;

        const user = await User.findByCredentials(email, password);

        const token = await user.generateAuthToken();

        res.send(genericResponse({ data: {user: token}}));
    }
    catch(err) {
        logger.info(`[login] Login failed with error`, payload, err);
        next(err);
    }
}

async function createUser(req, res, next) {
    try{
        const payload = req.body;
        const newUser = new User(payload);

        const { email, username } = payload;

        const user = await getUserByEmailOrUsername({email, username});

        if(user?.username == username){
            throw new ApiError(httpStatus.status.BAD_REQUEST, "The username is already taken");
        }

        if(user?.email == email){
            throw new ApiError(httpStatus.status.BAD_REQUEST, "The email is already taken");
        }

        await newUser.save();

        const token = await newUser.generateAuthToken();

        res.send(genericResponse({ data: {user: newUser, token}}));

    }
    catch(err){
        logger.info(`[Create User] Create User failed with error`, err);
        res.status(err.statusCode).send(genericResponse({ success: false, errorMessage: err.message}))
    }
}

async function listUsers(req, res, next) {
    try{    
        const users = await listUserQuery();
        if(!users) {
            throw new ApiError(httpStatus.status.NOT_FOUND, "Can't find any users")
        }

        res.send(genericResponse({success: true, data: {users}}))
    }
    catch(err) {
        logger.info(`[ListUsers] List Users failed with error`, err);
        res.status(err.statusCode).send(genericResponse({ success: false, errorMessage: err.message}))
    }
}


async function getUsersByIdsHandler(req, res, next) {
    try{    
        const { ids } = req.body;

        if(!Array.isArray(ids) || ids.some(id => typeof id !== 'string')) {
            throw new ApiError(httpStatus.status.BAD_REQUEST, "Invalid Id Input");
        }

        const users = await getUsersByIds(ids);
console.log(users)
        if(!users || users.length === 0) {
            throw new ApiError(httpStatus.status.NOT_FOUND, "No users found with ids")
        }

        res.send(genericResponse({ success: true, status: httpStatus.status.OK, data: users.map(user => user.toJSON())}))
    }
    catch(err) {
        logger.info(`[GetUsersByIdsHandler] Fetching users failed: ${err.message}`)
        res.status(err.statusCode).send(genericResponse({ success: false, errorMessage: err.message}))
    }
}

async function followUser(req, res, next) {
    const payload = req.body;
    const followerUser = new User(req?.user)
    try {

        let { followingUserId } = payload;

        if(!followingUserId?.id === followingUserId) {
            throw new ApiError(httpStatus.status.BAD_REQUEST, "User cannot follow themselves");
        }
        
        const followingUser = await getUsersById(followingUserId)

        if(!followingUser) {
            throw new ApiError(httpStatus.status.BAD_REQUEST, "The user does not exist");
        }
        await followUserAndUpdate({ followerUser, followingUser}) 

        res.send(genericResponse({ success: true}));
    }
    catch(err) {
        logger.info(`[followUser] Error: ${err.message}`)
        res.status(err.statusCode).send(genericResponse({ success: false, errorMessage: err.message}))
    }
}

async function unfollowUser(req, res, next) {
    const payload = req.body;
    const followerUser = new User(req?.user)
    try {

        let { followingUserId } = payload;

        if(!followingUserId?.id === followingUserId) {
            throw new ApiError(httpStatus.status.BAD_REQUEST, "User cannot follow themselves");
        }
        
        const followingUser = await getUsersById(followingUserId)

        if(!followingUser) {
            throw new ApiError(httpStatus.status.BAD_REQUEST, "The user does not exist");
        }
        await unfollowUserAndUpdate({ followerUser, followingUser}) 

        res.send(genericResponse({ success: true}));
    }
    catch(err) {
        logger.info(`[followUser] Error: ${err.message}`)
        res.status(err.statusCode).send(genericResponse({ success: false, errorMessage: err.message}))
    }
}

module.exports = { login, createUser, listUsers, getUsersByIdsHandler, followUser, unfollowUser }
