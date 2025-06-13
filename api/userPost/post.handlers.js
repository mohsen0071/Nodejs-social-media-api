const httpStatus = require("http-status");
const ApiError = require("../../utils/ApiError");

const User = require("../user/user");
const Post = require("./post");
const genericResponse = require('../../utils/genericResponse');
const logger = require('../../config/logger');
const sharp = require('sharp');

const postServices = require('./post.services');

const POST_PER_PAGE_LIMIT = 3;

async function createPost(req, res, next) {

    const authUser = new User(req?.user);
    
    const payload = req?.body;

    try {
       
        if(!authUser?.id) {
            throw new ApiError(httpStatus.status.NOT_FOUND, "No user found");
        }
   
        const newPost = Post(payload);

        newPost.userId = authUser?.id;
    
        const createPost = await newPost.save();

        if(!createPost?.id) {
            throw new ApiError(httpStatus.status.NOT_FOUND, "Error creating the post");
        }

        res.status(httpStatus.status.OK).send(genericResponse({ success: true, data : createPost}));
    } catch (err) {
       logger.info(`Create post failed ${ err.message}`);
      // res.status(err.statusCode || 400).send(genericResponse({ success: false, errorMessage: err.message})); 
    }
}

async function listPosts(req, res, next) {
    try {
        const posts = await postServices.listPosts();

        if (!posts) {
            throw new ApiError(httpStatus.status.NOT_FOUND, 'Error fetching the posts')
        }

        res.send(genericResponse({ success: true, data: posts}));

    }
    catch(err){
        logger.info(`[listPosts] Lists post failed ${err.message}`);
        res.status(err.statusCode).send(genericResponse({ success: false, errMessage: err.message}))
    }
}

async function listPostsWithPagination(req, res, next) { 

    const payload = req?.query;

    try {
        const { page } = payload;

        const skip = (page - 1) * POST_PER_PAGE_LIMIT

        const { total, posts } = await postServices.listPostsWithPagination(
            POST_PER_PAGE_LIMIT,
            skip
        )

        if(!posts) {
            throw new ApiError(httpStatus.NOT_FOUND, "Couldn't fetch the posts")
        }

        res.send(genericResponse({ success: true, data: { posts, total }}))
    }
    catch(err) {
        logger.info(`[listPostsWithPagination] Error: ${err.message}`)
        res.status(err.statusCode).send(genericResponse({ success: false, errMessage: err.message}))
    }


}

async function uploadPostImage(req, res, next) {
    const payload = req?.query;

    try{
        const { postId } = payload;

        const post = await postServices.getPostById(postId);
       
        if(!post?.id) {
            throw new ApiError(httpStatus.status.NOT_FOUND, 'No post with the given id')
        }

        const buffer = await sharp(req?.file?.buffer).resize({ width: 250, height: 250}).png().toBuffer();

        post.image = buffer;

        const updatedPost = await post.save();

        if(!updatedPost) {
           throw new ApiError(httpStatus.status.NOT_FOUND, "Error updating the image")
        }

        res.send(genericResponse({ success: true, data: updatedPost}))

    }
    catch(err){
      logger.info(`[uploadPostImage] Failed with error: ${err.message}`)
      res.status(err.statusCode).send(genericResponse({ success: false, errMessage: err.message}))
    }
}

async function getPostImageById(req, res, next) {
    const { postId } = req?.params;

    try{
        const post = await postServices.getPostById(postId)

        if(!post?.id) {
            throw new ApiError(httpStatus.status.NOT_FOUND, 'Not found')
        }
        if(!post?.image) {
            throw new ApiError(httpStatus.status.NOT_FOUND, 'Post has no image')
        }

        res.set("Content-Type", "image/jpg");
        res.send(post?.image)
    }
    catch(err){
      logger.info(`[getPostImageById] Failed with error: ${err.message}`)
      res.status(err.statusCode).send(genericResponse({ success: false, errMessage: err.message}))
    }
}

async function likePost(req, res, next) {
    const { postId } = req?.body;

    const authUser = new User(req?.user);

    try{
        const post = await postServices.getPostById(postId)

        if(!post?.id) {
            throw new ApiError(httpStatus.status.NOT_FOUND, 'Not found')
        }

        if(!post?.likes.includes(authUser?.id)) {
            await post.updateOne({ $push: { likes: authUser?.id }})
        }

        res.send(genericResponse({ success: true}));
    }
    catch(err){
      logger.info(`[likePost] Failed with error: ${err.message}`)
      res.status(err.statusCode).send(genericResponse({ success: false, errMessage: err.message}))
    }
}

async function unlikePost(req, res, next) {
    const { postId } = req?.body;

    const authUser = new User(req?.user);

    try{
        const post = await postServices.getPostById(postId)

        if(!post?.id) {
            throw new ApiError(httpStatus.status.NOT_FOUND, 'Not found')
        }

        if(post?.likes.includes(authUser?.id)) {
            await post.updateOne({ $pull: { likes: authUser?.id }})
        }

        res.send(genericResponse({ success: true}));
    }
    catch(err){
      logger.info(`[likePost] Failed with error: ${err.message}`)
      res.status(err.statusCode).send(genericResponse({ success: false, errMessage: err.message}))
    }
}

module.exports = { createPost, listPosts, listPostsWithPagination, uploadPostImage, getPostImageById, likePost, unlikePost };