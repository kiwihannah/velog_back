// modules
const { ControllerAsyncWrapper } = require("../utils/module");

// models
const PostModel = require("../businessModels/PostModel");
const LikeModel = require("../businessModels/LikeModel");

module.exports = {
  create: {
    post: ControllerAsyncWrapper(async (req, res) => {
      const userId = res.locals.user.id;
      const { title, context, preview } = req.body;

      let thumbnail = "";
      PostModel.get.thumbnail(context, result => {
        thumbnail = result;
      });

      const id = await PostModel.create.post({ title, context, preview, thumbnail, userId });

      return res.status(201).json({ postId: id });
    }),
  },

  update: {
    post: ControllerAsyncWrapper(async (req, res) => {
      const userId = res.locals.user.id;
      const { postId } = req.params;
      const { title, context, preview } = req.body;

      PostModel.get.thumbnail(context, result => {
        thumbnail = result;
      });

      const id = await PostModel.update.post(
        { postId, title, context, preview, thumbnail, userId }
      );

      return res.status(201).json({ postId: id });
    }),
  },

  get: {
    post: ControllerAsyncWrapper(async (req, res) => {
      const userId = req.query.id;
      const { postId } = req.params;
      let isLiking = false;

      const post = await PostModel.get.post(postId);

      if(userId) {
        isLiking = await LikeModel.get.isLiking({ postId, userId });
      }

      return res.status(200).json({
        post: post,
        isLiking: isLiking,
      });
    }),

    posts: ControllerAsyncWrapper(async (req, res) => {
      const posts = await PostModel.get.posts();

      return res.status(200).json(posts);
    }),

    userPosts: ControllerAsyncWrapper(async (req, res) => {
      const { userId } = req.params;

      const posts = await PostModel.get.userPosts(userId);

      return res.status(200).json(posts);
    }),
  },

  delete: {
    post: ControllerAsyncWrapper(async (req, res) => {
      const { postId } = req.params;

      await PostModel.delete.post(postId);

      return res.status(200).json({ msg: "???????????? ?????????????????????." });
    }),
  }
};