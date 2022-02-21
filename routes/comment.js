/**
 * Comment CRUD w/ infinite Reply
 */
const express = require('express');
const sequelize = require('sequelize');
const router = express.Router();
const { Comment } = require('../models');
let isDeleted = 'N'; const userId = 3;

// CREATE api/post/3/comment/2
router.post('/:postId/comment/:commentId', async (req, res) => { 
  const { commentBody } = req.body;
  const { commentId, postId } = req.params;
  if (!commentBody) return res.status(400).json({ msg: '댓글 내용이 없습니다.' });
  try {
    const isParents = await Comment.findAll({where: [{ id : commentId }, { isDeleted }] });
    console.log(isParents)
    if (!isParents.length) {
      return res.status(400).json({ msg: '대댓글을 작성할 수 없는 댓글 입니다.' });
    } else {
      await Comment.create({
        parentsId: Number(commentId) !== 0 ? commentId : 0,
        commentBody,
        isDeleted
      });
      return res.status(200).json({ msg: '댓글이 등록되었습니다.' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: '서버 내부 에러' });
  }
});

// GET 부모 코멘트 모두 불러오기 /api/post/3/comment
router.get("/:postId/comments", async (req, res) => {
  const { postId } = req.params;
  try {
    const comment = await Comment.findAll({where: [{ postId }, { isDeleted }] });
    console.log(comment)
    return res.status(200).send({ comment, });
  } catch(error) {
    console.error(error);
    return res.status(500).json({ msg: "서버 내부 에러" });
  };
});

// GET /api/post/3/comment/2 (child)
router.get("/:postId/comments/:commentId", async (req, res) => {
    const { commentId } = req.params;
    try {
      const comment = await Comment.findAll({where: [{ parentsId : commentId }, { isDeleted }] });
      return res.status(200).json({ comment, userId });
    } catch(error) {
      console.error(error);
      return res.status(500).json({ msg: "서버 내부 에러" });
    };
});

// MODIFY api/post/13/comment/2
router.patch('/:postId/comment/:commentId', async (req, res) => {
  try {
    const { commentId } = req.params;
    const { commentBody } = req.body;

    // 자기 댓글이 아닐경우 msg : '본인 댓글만 수정할 수 있습니다.'
    if (!commentBody) return res.status(400).json({ msg: '댓글 내용이 없습니다.' });

    const prevComment = await Comment.findOne({ where: { id: commentId } });
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

// PATCH api/post/3/comment/6/disabled
router.patch('/:postId/comment/:commentId/disabled', async (req, res) => {
  try {
    const { commentId } = req.params;

    const prevComment = await Comment.findOne({ where: { id: commentId } });
    // 자기 댓글이 아닐경우 msg : '본인 댓글만 삭제할 수 있습니다.'
    if (!prevComment) {
      return res.status(400).json({ msg: '해당 댓글을 찾을 수 없습니다.' });
    } else {
      const isDeleted = 'Y';
      await prevComment.update({ isDeleted });
      return res.status(200).json({ msg: '댓글을 삭제하였습니다.' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: '서버 내부 에러' });
  }
});

module.exports = router;
