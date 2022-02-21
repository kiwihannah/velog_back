const express = require("express");
const router = express.Router();
// controllers
const CommentController = require("../controllers/commentController");
  
// /api/post
router.post("/:postId/comment/:commentId", CommentController.create.comment); // 포스트 작성 CREATE api/post/3/comment/2

module.exports = router;