const express = require("express");

const router = express.Router();

// controllers
const PostController = require("../controllers/PostController");
const LikeController = require("../controllers/LikeController");
  
// endpoints
router.post("/", PostController.create.post);                    // 포스트 작성 POST /api/post
router.put("/:postId", PostController.update.post);              // 게시글 수정 PUT /api/post/13
router.delete("/:postId", PostController.delete.post);           // 게시글 삭제 DELETE /api/post/3
router.get("/:postId/likes", LikeController.create.like);        // 게시글 좋아요 GET /api/post/3/likes
router.delete("/:postId/likes", LikeController.delete.like);     // 게시글 좋아요 취소 DELETE /api/post/3/likes

module.exports = router;