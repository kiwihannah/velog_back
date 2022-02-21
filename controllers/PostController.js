// models
const PostModel = require("../businessModels/PostModel");
const LikeModel = require("../businessModels/LikeModel");

module.exports = {
  create: {
    post: async (req, res) => {
      const sampleUserId = 1;
      const { title, context, preview } = req.body;

      let thumbnail = "";
      let postId = 0;

      PostModel.get.thumbnail(context, result => {
        thumbnail = result;
      });

      await PostModel.create.post({ title, context, preview, thumbnail, sampleUserId }, CREATE_POST_RESULT => {
        if(CREATE_POST_RESULT.msg) { return res.status(400).json(CREATE_POST_RESULT); }

        postId = CREATE_POST_RESULT;
      });

      return res.status(201).json({ postId });
    },
  },

  update: {
    post: async (req, res) => {
      const sampleUserId = 1;
      const { postId } = req.params;
      const { title, context, preview } = req.body;
      
      let thumbnail = "";
      let updatedPostId = 0;
      
      PostModel.get.thumbnail(context, result => {
        thumbnail = result;
      });

      await PostModel.update.post({ postId, title, context, preview, thumbnail, sampleUserId}, UPDATE_POST_RESULT => {
        if(UPDATE_POST_RESULT.msg) { return res.status(400).json(UPDATE_POST_RESULT) };
        
        updatedPostId = UPDATE_POST_RESULT;
      });
      
      return res.status(201).json({ postId: updatedPostId });
    },
  },

  get: {
    post: async (req, res) => {
      const sampleUserId = 1;
      const { postId } = req.params;

      let post = {};
      let isLiking = false;

      await PostModel.get.post({ postId }, GET_POST_RESULT => {
        if(GET_POST_RESULT.msg) {
          return res.status(400).json(GET_POST_RESULT.msg);
        };

        post = GET_POST_RESULT;
      });

      await LikeModel.get.isLiking({ postId, userId: sampleUserId }, GET_ISLIKING_RESULT => {
        if(GET_ISLIKING_RESULT.msg) { return res.status(400).json(GET_ISLIKING_RESULT) };

        isLiking = GET_ISLIKING_RESULT;
      });

      return res.status(200).json({
        post,
        isLiking,
      });
    },

    posts: async (req, res) => {
      let posts = [];

      await PostModel.get.posts(GET_POSTS_RESULT => {
        if(GET_POSTS_RESULT.msg) {
          return res.status(400).json(GET_POSTS_RESULT.msg);
        };

        posts = GET_POSTS_RESULT;
      });

      return res.status(200).json(posts);
    },

    userPosts: async (req, res) => {
      const { userId } = req.params;

      let posts = [];

      await PostModel.get.userPosts(userId, GET_USERPOSTS_RESULT => {
        if(GET_USERPOSTS_RESULT.msg) {
          return res.status(400).json(GET_USERPOSTS_RESULT.msg);
        };

        posts = GET_USERPOSTS_RESULT;
      });

      return res.status(200).json(posts);
    },
  },

  delete: {
    post: (req, res) => {
      const { postId } = req.params;

      PostModel.delete.post(postId, DELETE_POST_RESULT => {
        if(DELETE_POST_RESULT.msg) {
          return res.status(400).json(DELETE_POST_RESULT);
        }

        return res.status(200).json({ msg: "포스트를 삭제하였습니다." });
      });
    },
  }
};