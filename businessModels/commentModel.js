// utils
const { ModelAsyncWrapper } = require("../utils/module");
// tables
const { Comment, User } = require("../models");

module.exports = {
  create: {
    comment: ModelAsyncWrapper(async (data) => {
      if(!data.commentBody) throw ({ msg: '댓글 내용이 없습니다.' });
      if (data.commentId) {
        Comment.sequelize.query( 
          `UPDATE comments SET replyCnt = replyCnt + 1 WHERE id=${data.commentId};`, 
          (err) => { if (err) throw err; } 
        );
      }
      await Comment.create({
        parentsId : Number(data.commentId) !== 0 ? data.commentId : 0,
        commentBody : data.commentBody,
        isDeleted : data.isDeleted,
        userId : data.userId, 
        postId : data.postId,
        replyCnt : 0
      });
    }),
  },

  update: {
    comment: ModelAsyncWrapper(async (data) => {
      if(!data.commentBody) throw ({ msg: '댓글 내용이 없습니다.' });
      const prevComment = await Comment.findOne({ where: { id: data.commentId } });
      if(!prevComment) {
        throw ({ msg: "해당 댓글을 찾을 수 없습니다." })
      } else {
        await prevComment.update({ commentBody : data.commentBody});
      }
    }),
  },

  get: {
    commentsParents: ModelAsyncWrapper(async (data) => {
      const comments = await Comment.findAll({
        where: {
          postId : data.postId,
          isDeleted : 'N'
        },
        include: {
          model: User,
          attributes: ["id", "nickname"],
        },
        order: [["createdAt", "ASC"]],
      });
      return comments;
    }),
    commentsChild: ModelAsyncWrapper(async (data) => {
      const comments = await Comment.findAll({
        where: {
          parentsId : data.commentId,
          isDeleted : 'N'
        },
        include: {
          model: User,
          attributes: ["id", "nickname"],
        },
        order: [["createdAt", "ASC"]],
      });
      return comments;
    }),
  },
  delete: {
    comment: ModelAsyncWrapper(async (data) => {
      const prevComment = await Comment.findOne({ where: { id: data.commentId } });
      if (data.commentId) {
        Comment.sequelize.query( 
          `UPDATE comments SET replyCnt = replyCnt - 1 WHERE id=${prevComment.parentsId};`, 
          (err) => { if (err) throw err; } 
        );
      }
      if(!prevComment) {
        throw ({ msg: "해당 댓글을 찾을 수 없습니다." })
      } else {
        await prevComment.update({ isDeleted : 'Y' });
        return ({ msg: '댓글을 삭제하였습니다.' });
      }
    }),
  },
};