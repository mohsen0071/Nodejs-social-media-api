const httpStatus = require("http-status");
const ApiError = require("../../utils/ApiError");

const Comment = require("./comment");
const User = require("../user/user");

const genericResponse = require("../../utils/genericResponse");
const logger = require("../../config/logger");

const { getPostById } = require("../userPost/post.services");
const commentServices = require("./comment.service");

async function createComment(req, res, next) {
  const authUser = new User(req?.user);
  const payload = req?.body;

  try {
    const { postId } = payload;

    const newComment = new Comment(payload);

    if (!authUser?.id) {
      throw new ApiError(httpStatus.status.NOT_FOUND, "No user found");
    }

    const post = await getPostById({ postId });

    if (!post?.id) {
      throw new ApiError(httpStatus.status.NOT_FOUND, "Post not found");
    }
    newComment.userId = authUser?.id;
    newComment.postId = post.id;

    const createComment = await newComment.save();

    if (!createComment?.id) {
      throw new ApiError(
        httpStatus.status.NOT_FOUND,
        "Error creating the comment"
      );
    }

    res
      .status(httpStatus.status.OK)
      .send(genericResponse({ success: true, data: createComment }));
  } catch (err) {
    logger.info(`Create comment failed ${err.message}`);
    res
      .status(err.statusCode)
      .send(genericResponse({ success: false, errorMessage: err.message }));
  }
}

async function listCommentByPost(req, res, next) {
  const { postId } = req?.params;

  try {
    const post = await getPostById({ postId });

    if (!post.id) {
      throw new ApiError(httpStatus.status.NOT_FOUND, "Post doesn't exist");
    }
    const comments = await commentServices.listCommentByPostId({ postId });
    console.log("comments", comments);
    if (!comments) {
      throw new ApiError(
        httpStatus.status.NOT_FOUND,
        "Error getting the comment"
      );
    }
    res
      .status(httpStatus.status.OK)
      .send(genericResponse({ success: true, data: comments }));
  } catch (err) {
    logger.info(`[listCommentByPost ] Error ${err.message}`);
    res
      .status(err.statusCode)
      .send(genericResponse({ success: false, errorMessage: err.message }));
  }
}

async function deleteComment(req, res, next) {

  const { commentId } = req?.params;

  try {
    const comment = await commentServices.getCommentById(commentId);
    console.log('comment', comment, commentId);
    if (!comment._id) {
      throw new ApiError(httpStatus.status.NOT_FOUND, "Comment doesn't exist");
    }

    await Comment.findByIdAndDelete(commentId)

    res
      .status(httpStatus.status.OK)
      .send(genericResponse({ success: true }));
  } catch (err) {
    logger.info(`[deleteComment ] Error ${err.message}`);
    res
      .status(err.statusCode)
      .send(genericResponse({ success: false, errorMessage: err.message }));
  }
}

module.exports = { createComment, listCommentByPost, deleteComment };
