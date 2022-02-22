// modules
const { ControllerAsyncWrapper } = require("../utils/module");
// models
const CommentModel = require("../businessModels/commentModel");
//samples
const userId = 1;

module.exports = {
  create: {
    comment: ControllerAsyncWrapper(async (req, res) => {
      const { commentBody } = req.body;
      const { commentId, postId } = req.params;
      const isDeleted = 'N';
      await CommentModel.create.comment({ commentBody, commentId, isDeleted, postId, userId });
      return res.status(201).json({});
    }),
  },

  update: {
    comment: ControllerAsyncWrapper(async (req, res) => {
      const { commentId } = req.params;
      const { commentBody, postId } = req.body;
      await CommentModel.update.comment({ commentId, commentBody, userId, postId });
      return res.status(201).json({});
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
      const { commentId } = req.params; 
      await CommentModel.delete.comment({ commentId });
      return res.status(200).json({});
    }),
  }
};