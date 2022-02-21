const sequelize = require("sequelize");

// utils
const { ModelAsyncWrapper } = require("../utils/module");

// tables
const { Post, User } = require("../models");

module.exports = {
  create: {
    post: ModelAsyncWrapper(async (data) => {
      if(!data.title || !data.context || !data.preview) {
        throw ({ msg: "제목, 내용, 미리보기 중 전달되지 않은 것이 있습니다." });
      };

      const post = await Post.create({
        userId: data.sampleUserId,
        title: data.title,
        context: data.context,
        preview: data.preview,
        thumbnail: data.thumbnail ? data.thumbnail : "",
      });

      return post.id;
    }),
  },

  update: {
    post: ModelAsyncWrapper(async (data) => {
      if(!data.title || !data.context || !data.preview) {
        throw ({ msg: "제목, 내용, 미리보기 중 전달되지 않은 것이 있습니다." });
      };

      const prevPost = await Post.findOne({
        where: { id: data.postId },
      });
      if(!prevPost) {
        throw ({ msg: "해당 포스트를 찾을 수 없습니다." });
      };

      const post = await prevPost.update({
        title: data.title,
        context: data.context,
        preview: data.preview,
        thumbnail: data.thumbnail ? data.thumbnail : "",
        userId: data.sampleUserId,
      });

      return post.id;
    }),
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

    post: ModelAsyncWrapper(async (data) => {
      const post = await Post.findOne({
        where: { id: data },
        attributes: [
          "id", "title", "thumbnail", "context", "createdAt", "likeCnt",
          [sequelize.literal(`(SELECT COUNT(*) FROM Comments WHERE Comments.postId=${data})`), "commentCnt"],
        ],
        include: {
          model: User,
          attributes: ["id", "nickname"],
        },
      });

      return post;
    }),

    posts: ModelAsyncWrapper(async () => {
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

      return posts;
    }),

    userPosts: ModelAsyncWrapper(async (data) => {
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
      });

      return posts;
    }),
  },

  delete: {
    post: ModelAsyncWrapper(async (data) => {
      const isDeleted = await Post.destroy({
        where: { id: data },
      });
      if(!isDeleted) {
        throw ({ msg: "해당 포스트를 찾을 수 없습니다." })
      };

      return true;
    }),
  },
};