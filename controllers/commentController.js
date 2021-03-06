// modules
const { ControllerAsyncWrapper } = require("../utils/module");
// models
const CommentModel = require("../businessModels/commentModel");

module.exports = {
  create: {
    comment: ControllerAsyncWrapper(async (req, res) => {
      const { commentBody, userId } = req.body;
      const { commentId, postId } = req.params;
      const isDeleted = 'N';
      const comment = await CommentModel.create.comment({ commentBody, commentId, isDeleted, postId, userId });
      return res.status(201).json({ comment });
    }),
  },

  update: {
    comment: ControllerAsyncWrapper(async (req, res) => {
      const userId = res.locals.userId;
      const { commentId } = req.params;
      const { commentBody, postId } = req.body;
      await CommentModel.update.comment({ commentId, commentBody, userId, postId });
      return res.status(201).json({ msg : '댓글이 수정되었습니다.' });
    }),
  },

  get: {
    commentsParents: ControllerAsyncWrapper(async (req, res) => {
      const { postId } = req.params;
      const commentsParents = await CommentModel.get.commentsParents({ postId }) 
      return res.status(200).json({ commentsParents });
    }),
    commentsChild: ControllerAsyncWrapper(async (req, res) => {
      const { commentId } = req.params;
      const commentsChild = await CommentModel.get.commentsChild({ commentId });
      return res.status(200).json({ commentsChild });
    }),
  },

  delete: {
    comment: ControllerAsyncWrapper(async (req, res) => {
      const userId = res.locals.userId;
      const { commentId, postId } = req.params; 
      await CommentModel.delete.comment({ commentId, postId });
      return res.status(200).json({ msg : '정말로 댓글을 삭제 하시겠습니까?' });
    }),
  }
};