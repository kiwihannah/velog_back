const sequelize = require("sequelize");

// tables
const { Post, Like } = require("../models");

module.exports = {
  create: {
    like: async (data, callback) => {
      try {
        const [like, isLiked] = await Like.findOrCreate({
          where: { postId: data.postId },
          defaults: {
            likedId: data.sampleUserId,
          }
        });
        if(!isLiked) { return callback({ msg: "이미 좋아요를 한 포스트입니다." }); };

        callback(true);
      } catch(error) {
        console.error(error);
        callback({ msg: "좋아요 에러" });
      }
    },
  },

  get: {
    isLiking: async (data, callback) => {
      try {
        const isLiking = await Like.findOne({
          where: {
            postId: data.postId,
            likedId: data.userId,
          },
        });

        callback(isLiking ? true : false);
      } catch(error) {
        console.error(error);
        callback({ msg: "좋아요 확인 에러" });
      }
    },

    likeCount: async(data, callback) => {
      try {
        const post = await Post.findOne({
          where: { id: data },
          attributes: [
            [sequelize.literal(`(SELECT COUNT(*) FROM Likes WHERE Likes.postId=${data})`), "likersCount"],
          ],
        });
        if(!post) {
          return callback({ msg: "존재하지 않는 포스트입니다." });
        }

        callback(post);
      } catch(error) {
        console.error(error);
        callback({ msg: "좋아요 수 카운트 에러" });
      }
    },
  },

  delete: {
    like: async (data, callback) => {
      try {
        await Like.destroy({
          where: {
            postId: data.postId,
            likedId: data.sampleUserId,
          },
        });
  
        callback(true);
      } catch(error) {
        console.error(error);
        callback({ msg: "좋아요 취소 에러" });
      }
    },
  },
};