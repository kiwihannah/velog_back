// tables
const { Post, Like } = require("../models");
const { ModelAsyncWrapper } = require("../utils/module");

module.exports = {
  create: {
    like: ModelAsyncWrapper(async (data) => {
      const { postId, userId } = data;
      const [like, isLiked] = await Like.findOrCreate({
        where: {
          postId: postId,
          likedId: userId,
        },
        defaults: {
          likedId: userId,
        }
      });
      if(!isLiked) {
        throw({ msg: "이미 좋아요를 한 포스트입니다." });
      };

      const post = await Post.findOne({
        where: { id: postId },
      });
      await post.increment("likeCnt");

      return post;
    }),
  },

  get: {
    isLiking: ModelAsyncWrapper(async (data) => {
      const { postId, userId } = data;
      const isLiking = await Like.findOne({
        where: {
          postId: postId,
          likedId: userId,
        },
      }); 

      return isLiking ? true : false;
    }),

    likeCount: ModelAsyncWrapper(async (data) => {
      const post = await Post.findOne({
        where: { id: data },
        attributes: ["likeCnt"],
      });
      if(!post) {
        throw({ msg: "존재하지 않는 포스트입니다." });
      };

      return post;
    }),
  },

  delete: {
    like: ModelAsyncWrapper(async (data) => {
      await Like.destroy({
        where: {
          postId: data.postId,
          likedId: data.userId,
        },
      });

      const post = await Post.findOne({
        where: { id: data.postId },
      });
      await post.decrement("likeCnt");
  
      return true;
    }),
  },
};