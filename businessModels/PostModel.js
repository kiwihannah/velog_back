const sequelize = require("sequelize");

// tables
const { Post, User } = require("../models");

module.exports = {
  create: {
    post: async (data, callback) => {
      try {
        if(!data.title || !data.context || !data.preview) {
          return callback({ msg: "제목, 내용, 미리보기 중 전달되지 않은 것이 있습니다." });
        };
  
        const post = await Post.create({
          userId: data.sampleUserId,
          title: data.title,
          context: data.context,
          preview: data.preview,
          thumbnail: data.thumbnail ? data.thumbnail : "",
        });
        
        callback(post.id);
      } catch(error) {
        console.error(error);
        callback({ msg: "포스트 작성 에러" });
      }
    },
  },

  update: {
    post: async (data, callback) => {
      try {
        if(!data.title || !data.context || !data.preview) {
          return callback({ msg: "제목, 내용, 미리보기 중 전달되지 않은 것이 있습니다." });
        };
  
        const prevPost = await Post.findOne({
          where: { id: data.postId },
        });
        if(!prevPost) {
          return callback({ msg: "해당 포스트를 찾을 수 없습니다." })
        };
  
        const post = await prevPost.update({
          title: data.title,
          context: data.context,
          preview: data.preview,
          thumbnail: data.thumbnail ? data.thumbnail : "",
          userId: data.sampleUserId,
        });

        callback(post.id);
      } catch(error) {
        console.error(error);
        callback({ msg: "포스트 수정 에러" });
      }
    },
  },

  get: {
    thumbnail: (data, callback) => {
      const imgRex = /<img.*?src="(.*?)"[^>]+>/g; 
      let thumbnail = "";
      let img;

      while((img = imgRex.exec(data))) {
         thumbnail = img[1];
         break;
      };

      callback(thumbnail);
    },

    post: async (data, callback) => {
      try {
        const post = await Post.findOne({
          where: { id: data.postId },
          attributes: [
            "id", "title", "thumbnail", "context", "createdAt", "likeCnt",
            [sequelize.literal(`(SELECT COUNT(*) FROM Comments WHERE Comments.postId=${data.postId})`), "commentCnt"],
          ],
          include: {
            model: User,
            attributes: ["id", "nickname"],
          },
        });

        callback(post);
      } catch(error) {
        console.error(error);
        callback({ msg: "포스트 가져오기 에러" });
      };
    },

    posts: async (callback) => {
      try {
        const posts = await Post.findAll({
          attributes: [
            "id", "title", "preview", "thumbnail", "likeCnt", "createdAt"
          ],
          include: {
            model: User,
            attributes: ["id", "nickname"],
          },
          order: [["createdAt", "DESC"]],
        });

        callback(posts);
      } catch(error) {
        console.error(error);
        callback({ msg: "전체 포스트 조회 에러" });
      }
    },

    userPosts: async (data, callback) => {
      try {
        const posts = await Post.findAll({
          where: { userId: data },
          attributes: [
            "id", "title", "preview", "thumbnail", "likeCnt", "createdAt"
          ],
          include: {
            model: User,
            attributes: ["id", "nickname"],
          },
          order: [["createdAt", "DESC"]],
        })

        callback(posts);
      } catch(error) {
        console.error(error);
        callback({ msg: "특정 유저의 포스트 조회 에러" });
      }
    }
  },

  delete: {
    post: async (data, callback) => {
      try {
        const isDeleted = await Post.destroy({
           where: { id: data },
         });
         if(!isDeleted) {
           return callback({ msg: "해당 포스트를 찾을 수 없습니다." })
        };

        callback(true);
      } catch(error) {
        console.error(error);
        callback({ msg: "포스트 삭제 에러" });
      }
    },
  },
};