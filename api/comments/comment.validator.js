const Joi = require('joi');

const createComment = {
    body: Joi.object().keys({
        text: Joi.string().trim().required(),
        postId: Joi.string().hex().message("postId must be valid").length(24).required()
    })
}

const listComment = {
    params: Joi.object().keys({
        postId: Joi.string().hex().message("postId must be valid").length(24).required()
    })
}

const deleteComment = {
    params: Joi.object().keys({
        commentId: Joi.string().hex().message("commentId must be valid").length(24).required()
    })
}

module.exports = { createComment, listComment, deleteComment };