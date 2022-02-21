// modules
const { ControllerAsyncWrapper } = require("../utils/module");

// models
const PostModel = require("../businessModels/PostModel");
const LikeModel = require("../businessModels/LikeModel");

module.exports = {
  create: {
    post: ControllerAsyncWrapper(async (req, res) => {
      const sampleUserId = 1;
      const { title, context, preview } = req.body;

      let thumbnail = "";
      PostModel.get.thumbnail(context, result => {
        thumbnail = result;
      });

      const id = await PostModel.create.post({ title, context, preview, thumbnail, sampleUserId });

      return res.status(201).json({ postId: id });
    }),
  },

  update: {
    post: ControllerAsyncWrapper(async (req, res) => {
      const sampleUserId = 1;
      const { postId } = req.params;
      const { title, context, preview } = req.body;

      PostModel.get.thumbnail(context, result => {
        thumbnail = result;
      });

      const id = await PostModel.update.post(
        { postId, title, context, preview, thumbnail, sampleUserId}
      );

      return res.status(201).json({ postId: id });
    }),
  },

  get: {
    post: ControllerAsyncWrapper(async (req, res) => {
      const sampleUserId = 1;
      const { postId } = req.params;

      const post = await PostModel.get.post(postId);

      const isLiking = await LikeModel.get.isLiking({ postId, userId: sampleUserId });

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

      return res.status(200).json({ msg: "포스트를 삭제하였습니다." });
    }),
    // post: (req, res) => {
    //   const { postId } = req.params;

    //   PostModel.delete.post(postId, DELETE_POST_RESULT => {
    //     if(DELETE_POST_RESULT.msg) {
    //       return res.status(400).json(DELETE_POST_RESULT);
    //     }

    //     return res.status(200).json({ msg: "포스트를 삭제하였습니다." });
    //   });
    // },
  }
};