const Comment = require('./comment');

async function listCommentByPostId( postId ) {
    return Comment.find(postId).sort({ createdAt: -1})
}

async function getCommentById( commentId ) {
    return Comment.findById(commentId)
}


module.exports = { listCommentByPostId, getCommentById }