// modules
const { ControllerAsyncWrapper } = require("../utils/module");
// models
const CommentModel = require("../businessModels/commentModel");

module.exports = {
  create: {
    comment: ControllerAsyncWrapper(async (req, res) => {
      const userId = 1;
      const postId = 1;
      const { commentBody } = req.body;
      const { commentId } = req.params;
      const isDeleted = 'N';
      await CommentModel.create.comment({ 
        commentBody, commentId, isDeleted, postId, userId 
      });
      return res.status(200).json({ });
    }),
  },

  update: {
    comment: ControllerAsyncWrapper(async (req, res) => {
      const sampleUserId = 1;
      const { postId } = req.params;
      const { title, context, preview } = req.body;

      CommentModel.get.thumbnail(context, result => {
        thumbnail = result;
      });

      const id = await CommentModel.update.post(
        { postId, title, context, preview, thumbnail, sampleUserId}
      );

      return res.status(201).json({ postId: id });
    }),
  },

  get: {
    comment: ControllerAsyncWrapper(async (req, res) => {
      const sampleUserId = 1;
      const { postId } = req.params;

      const post = await CommentModel.get.post(postId);

      const isLiking = await CommentModel.get.isLiking({ postId, userId: sampleUserId });

      return res.status(200).json({
        post: post,
        isLiking: isLiking,
      });
    }),

    posts: ControllerAsyncWrapper(async (req, res) => {
      const posts = await CommentModel.get.posts();

      return res.status(200).json(posts);
    }),

    userPosts: ControllerAsyncWrapper(async (req, res) => {
      const { userId } = req.params;

      const posts = await CommentModel.get.userPosts(userId);

      return res.status(200).json(posts);
    }),
  },

  delete: {
    comment: ControllerAsyncWrapper(async (req, res) => {
      const { commentId } = req.params;

      await CommentModel.delete.post(postId);

      return res.status(200).json({ msg: "포스트를 삭제하였습니다." });
    }),
  }
};