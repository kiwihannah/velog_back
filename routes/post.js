const express = require("express");

const router = express.Router();

const { Post, User } = require("../models");

// 포스트 작성 POST /api/post
router.post("/", async(req, res) => {
  try {
    const sampleUserId = 1; // 임시

    const { title, thumbnail, preview, context } = req.body;

    if(!title || !preview || !context) {
      return res.status(400).json({ msg: "제목, 내용, 미리보기 중 전달되지 않은 것이 있습니다." });
    };

    const post = await Post.create({
      title,
      thumbnail: thumbnail ? thumbnail : "",
      preview,
      context,
      userId: sampleUserId,
    });

    const newPost = await Post.findOne({
      where: post.id,
      attributes: { exclude: ["updatedAt"] },
      include: {
        model: User,
        attributes: ["id", "nickname"],
      },
    });

    return res.status(201).json(newPost);
  } catch(error) {
    console.error(error);
    return res.status(500).json({ msg: "서버 내부 에러" });
  };
});

// 게시글 수정 PATCH /api/post/13
router.patch("/:postId", async (req, res) => {
  try {
    const sampleUserId = 1;

    const { postId } = req.params;

    const { title, thumbnail, preview, context } = req.body;
    if(!title || !preview || !context) {
      return res.status(400).json({ msg: "제목, 내용, 미리보기 중 전달되지 않은 것이 있습니다." });
    };

    const prevPost = await Post.findOne({
      where: { id: postId },
    });
    if(!prevPost) { return res.status(400).json({ msg: "해당 포스트를 찾을 수 없습니다." }); };

    const newPost = await prevPost.update({
      title,
      thumbnail: thumbnail ? thumbnail : "",
      preview,
      context,
    });

    return res.status(201).json(newPost);
  } catch(error) {
    console.error(error);
    return res.status(400).json({ msg: "서버 내부 에러" });
  };
});

module.exports = router;