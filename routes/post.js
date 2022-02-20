const express = require("express");

const router = express.Router();

// controllers
const PostController = require("../controllers/PostController");
  
// endpoints
router.post("/", PostController.createNewPost);               // 포스트 작성 POST /api/post
router.put("/:postId", PostController.editPost);              // 게시글 수정 PUT /api/post/13
router.delete("/:postId", PostController.deletePost);         // 게시글 삭제 DELETE /api/post/3
router.get("/:postId/likes", PostController.likePost);        // 게시글 좋아요 GET /api/post/3/likes
router.delete("/:postId/likes", PostController.dislikePost);  // 게시글 좋아요 취소 DELETE /api/post/3/likes

module.exports = router;