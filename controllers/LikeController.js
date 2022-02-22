// modules
const { ControllerAsyncWrapper } = require("../utils/module");

// models
const LikeModel = require("../businessModels/LikeModel");

module.exports = {
  create: {
    like: ControllerAsyncWrapper(async (req, res) => {
      const userId = res.locals.user.id;
      const { postId } = req.params;
      // const sampleUserId = 1;

      await LikeModel.create.like({ postId, userId });

      const post = await LikeModel.get.likeCount(postId)

      const isLiking = await LikeModel.get.isLiking({ postId, userId });

      return res.status(201).json({
        post: post,
        isLiking: isLiking,
      });
    }),
  },

  delete: {
    like: ControllerAsyncWrapper(async (req, res) => {
      const userId = res.locals.user.id;
      const { postId } = req.params;

      await LikeModel.delete.like({ postId, userId });

      const post = await LikeModel.get.likeCount(postId);

      const isLiking = await LikeModel.get.isLiking({ postId, userId });

      return res.status(200).json({
        post: post,
        isLiking: isLiking,
      });
    }),
  },
};