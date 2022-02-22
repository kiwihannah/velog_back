const express = require("express");

const router = express.Router();

// controllers
const PostController = require("../controllers/PostController");
const LikeController = require("../controllers/LikeController");

// middlewares
const authMiddleware = require("../middlewares/auth-middleware");
  
// /api/post
router.post("/post", authMiddleware, PostController.create.post);                     // 포스트 작성 POST /api/post

router.get("/post/:postId", PostController.get.post);                                 // 단일 포스트 조회 GET /api/post/4
router.put("/post/:postId", authMiddleware, PostController.update.post);              // 포스트 수정 PUT /api/post/13
router.delete("/post/:postId", authMiddleware, PostController.delete.post);           // 포스트 삭제 DELETE /api/post/3

router.get("/post/:postId/likes", authMiddleware, LikeController.create.like);        // 포스트 좋아요 GET /api/post/3/likes
router.delete("/post/:postId/likes", authMiddleware, LikeController.delete.like);     // 포스트 좋아요 취소 DELETE /api/post/3/likes

// /api/posts
router.get("/posts", PostController.get.posts);                                       // 전체 포스트 조회 GET /api/posts
router.get("/posts/:userId", PostController.get.userPosts);                           // 특정 유저의 포스트 조회 GET /api/posts/:userId

module.exports = router;