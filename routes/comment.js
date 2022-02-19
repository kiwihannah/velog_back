/**
 * Comment CRUD w/ infinite Reply
 */
const express = require('express');
const sequelize = require('sequelize');
const router = express.Router();

const { Post, User, Like, Comment } = require('../models');

// CREATE api/post/13/comment/2
router.post('/:commentId', async (req, res) => { 
  try {
    const { parentsId, commentBody } = req.body;
    const { commentId } = req.params;
    if (commentId) parentsId = commentId;
    await Comment.create({
      parentsId: parentsId ? parentsId : 0,
      commentBody,
    });
    return res.status(200).json({ msg: '댓글이 등록되었습니다.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: '서버 내부 에러' });
  }
});

// GET /api/post/3/comment
router.get("/", async (req, res) => {
  try {
    const comment = await Comment.find({ where: { postId } });
    const replyCnt = await Comment.find({ where: { parentsId : postId } });

    return res.status(200).send({ // moment("20120620", "YYYYMMDD").fromNow();
      comment,
      replyCnt: replyCnt.length,
    });

  } catch(error) {
    console.error(error);
    return res.status(500).json({ msg: "서버 내부 에러" });
  };
});

// GET /api/post/3/comment/2
router.get("/:commentId", async (req, res) => {
    const { commentId } = req.params;
    try {
      const comment = await Comment.find({ where: { parentsId : commentId } });
      return res.status(200).json({ 
        comment,
      });
  
    } catch(error) {
      console.error(error);
      return res.status(500).json({ msg: "서버 내부 에러" });
    };
});

// MODIFY api/post/13/comment/2
router.patch('/:commentId', async (req, res) => {
  try {
    const { commentId } = req.params;
    const { commentBody } = req.body;

    if (!commentBody) return res.status(400).json({ msg: '댓글 내용이 없습니다.' });

    const prevComment = await Post.findOne({ where: { id: commentId } });
    if (!prevComment) {
      return res.status(400).json({ msg: '해당 댓글을 찾을 수 없습니다.' });
    } else {
        await prevComment.update({ commentBody });
        return res.status(200).json({ msg: '해당 댓글을 수정했습니다.' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: '서버 내부 에러' });
  }
});

// DELETE api/post/13/comment/2
router.delete('/:commentId', async (req, res) => {
  try {
    const { commentId } = req.params;

    const isDeleted = await Comment.destroy({ where: { id: commentId } });
    if (!isDeleted) {
      return res.status(400).json({ msg: '해당 댓글을 찾을 수 없습니다.' });
    }
    return res.status(200).json({ msg: '댓글을 삭제하였습니다.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: '서버 내부 에러' });
  }
});

module.exports = router;
