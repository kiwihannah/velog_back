/**
 * Comment CRUD w/ infinite Reply
 */
const express = require('express');
const sequelize = require('sequelize');
const router = express.Router();
const { Comment } = require('../models');
let isDeleted = 'N'

// CREATE api/post/3/comment/2
router.post('/:postId/comment/:commentId', async (req, res) => { 
  const { commentBody } = req.body;
  const { commentId } = req.params;
  try {
    if (Number(commentId) !== 0) { // 자식 댓글
        await Comment.create({
            parentsId: Number(commentId),
            commentBody,
            isDeleted,
        });
    } else {
        await Comment.create({ // 부모 댓글
            commentBody,
            isDeleted,
        });
    }
    return res.status(200).json({ msg: '댓글이 등록되었습니다.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: '서버 내부 에러' });
  }
});

// GET /api/post/3/comment
router.get("/:postId/comments", async (req, res) => {
  const { postId } = req.params;
  console.log(postId, isDeleted, '#################')
  try {
    const comment = await Comment.find({ $and : [{ postId }, { isDeleted }] });
    return res.status(200).send({ comment, });
  } catch(error) {
    console.error(error);
    return res.status(500).json({ msg: "서버 내부 에러2" });
  };
});

// GET /api/post/3/comment/2 (child)
router.get("/:postId/comments/:commentId", async (req, res) => {
    const { commentId } = req.params;
    try {
      const comment = await Comment.find({ where: { parentsId : commentId } });
      const replyCnt = await Comment.find({ where: { parentsId : commentId } });

      return res.status(200).json({ 
        comment,
        replyCnt: replyCnt.length,
        cmtDate: moment(comment['createAt'], 'YYYYMMDD').fromNow(),
      });
  
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

// DELETE api/post/13/comment/2
router.patch('/:postId/comment/:commentId/disabled', async (req, res) => {
  try {
    const { commentId } = req.params;

    const prevComment = await Comment.findOne({ where: { id: commentId } });
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
