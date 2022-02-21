// models
const LikeModel = require("../businessModels/LikeModel");

module.exports = {
  create: {
    like: (req, res) => {
      const { postId } = req.params;
      const sampleUserId = 1;

      LikeModel.create.like({ postId, sampleUserId }, CREATE_LIKE_RESULT => {
        if(CREATE_LIKE_RESULT.msg) {
          return res.status(400).send(CREATE_LIKE_RESULT);
        };

        LikeModel.get.likeCount(postId, GET_LIKECOUNT_RESULT => {
          if(GET_LIKECOUNT_RESULT.msg) {
            return res.status(400).send(GET_LIKECOUNT_RESULT.msg);
          };

          return res.status(201).send({
            post: GET_LIKECOUNT_RESULT,
            isLiking: true,
          });
        });
      });
    },
  },

  delete: {
    like: (req, res) => {
      const { postId } = req.params;
      const sampleUserId = 1;

      LikeModel.delete.like({ postId, sampleUserId }, DELETE_LIKE_RESULT => {
        if(DELETE_LIKE_RESULT.msg) {
          return res.status(400).json(DELETE_LIKE_RESULT.msg);
        }

        LikeModel.get.likeCount(postId, GET_LIKECOUNT_RESULT => {
          if(GET_LIKECOUNT_RESULT.msg) {
            return res.status(400).json(GET_LIKECOUNT_RESULT.msg);
          }

          return res.status(201).send({
            post: GET_LIKECOUNT_RESULT,
            isLiking: false,
          });
        });
      });
    },
  },
};