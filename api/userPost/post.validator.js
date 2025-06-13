const Joi = require('joi');

const createPost = {
    body: Joi.object().keys({
        title: Joi.string().trim().required(),
        //userId: Joi.string().trim().required(),
    })
}

const listPostsWithPagination = {
    query: Joi.object().keys({
        page: Joi.optional().default(1)
    })
}

const uploadPostImage = {
    query: Joi.object().keys({
        postId: Joi.string().hex().message("postId must be valid").length(24).required()
    })
}

const getPostImage = {
    params: Joi.object().keys({
        postId: Joi.string().hex().message("postId must be valid").length(24).required()
    })
}

const likePost = {
    body: Joi.object().keys({
        postId: Joi.string().hex().message("postId must be valid").length(24).required()
    })
}

module.exports = { createPost, listPostsWithPagination, uploadPostImage, getPostImage, likePost }