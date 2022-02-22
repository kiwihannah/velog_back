const express = require("express");
const router = express.Router();
const CommentController = require("../controllers/commentController");
  
router.post("/:postId/comment/:commentId", CommentController.create.comment); 
router.get("/:postId/comments", CommentController.get.commentsParents);
router.get("/:postId/comments/:commentId", CommentController.get.commentsChild);
router.patch('/:postId/comment/:commentId', CommentController.update.comment);
router.patch('/:postId/comment/:commentId/disabled', CommentController.delete.comment);

module.exports = router;