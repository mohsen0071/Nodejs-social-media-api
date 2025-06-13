const express = require("express");

const handlers = require("./comment.handler");
const validator = require("./comment.validator");
const authUser = require('../../middleware/authUser');
const validate = require("../../middleware/validate");

const router = express.Router();

router.post("/", authUser, validate(validator.createComment), handlers.createComment);

router.get('/:postId', authUser, validate(validator.listComment), handlers.listCommentByPost)

router.delete('/:commentId', authUser, validate(validator.deleteComment), handlers.deleteComment)

module.exports = router;
