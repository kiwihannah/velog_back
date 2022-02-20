// models
const PostModel = require("../businessModels/PostModel");
const LikeModel = require("../businessModels/LikeModel");

module.exports = {
  create: {
    post: (req, res) => {
      const sampleUserId = 1;
      const { title, context, preview } = req.body;

      let thumbnail = "";

      PostModel.get.thumbnail(context, result => {
        thumbnail = result;
      });

      PostModel.create.post({ title, context, preview, thumbnail, sampleUserId }, CREATE_POST_RESULT => {
        if(CREATE_POST_RESULT.msg) { return res.status(400).json(CREATE_POST_RESULT); }

        PostModel.get.post({ postId: CREATE_POST_RESULT }, GET_POST_RESULT => {
          if(GET_POST_RESULT.msg) { return res.status(400).json(GET_POST_RESULT) };
          
          LikeModel.get.isLiking({ postId: GET_POST_RESULT.id, userId: sampleUserId }, GET_ISLIKING_RESULT => {
            if(GET_ISLIKING_RESULT.msg) { return res.status(400).json(GET_ISLIKING_RESULT) };

            return res.status(201).json({
              post: GET_POST_RESULT,
              isLiking: GET_ISLIKING_RESULT,
            });
          });
        });
      });
    },
  },

  update: {
    post: (req, res) => {
      const sampleUserId = 1;
      const { postId } = req.params;
      const { title, context, preview } = req.body;

      let thumbnail = "";
      
      PostModel.get.thumbnail(context, result => {
        thumbnail = result;
      });

      PostModel.update.post({ postId, title, context, preview, thumbnail, sampleUserId}, UPDATE_POST_RESULT => {
        if(UPDATE_POST_RESULT.msg) { return res.status(400).json(UPDATE_POST_RESULT) };
        
        PostModel.get.post({ postId: UPDATE_POST_RESULT }, GET_POST_RESULT => {
          if(GET_POST_RESULT.msg) { return res.status(400).json(GET_POST_RESULT) };

          LikeModel.get.isLiking({ postId: GET_POST_RESULT.id, userId: sampleUserId }, GET_ISLIKING_RESULT => {
            if(GET_ISLIKING_RESULT.msg) { return res.status(400).json(GET_ISLIKING_RESULT) };

            return res.status(201).json({
              post: GET_POST_RESULT,
              isLiking: GET_ISLIKING_RESULT,
            });
          });
        });
      });
    },
  },

  get: {

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