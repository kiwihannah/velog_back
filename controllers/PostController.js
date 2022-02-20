const sequelize = require("sequelize");

// models
const { Post, User, Like } = require("../models");

// controllers
const ImageController = require("./ImageController");

module.exports = {
  createNewPost: async function(req, res) {
    try {
      const sampleUserId = 1;

      const { title, context, preview } = req.body;
  
      if(!title || !preview || !context) {
        return res.status(400).json({ msg: "제목, 내용, 미리보기 중 전달되지 않은 것이 있습니다." });
      };
  
      const thumbnail = ImageController.getThumbnail(context);
  
      const post = await Post.create({
        title,
        thumbnail: thumbnail ? thumbnail : "",
        preview,
        context,
        userId: sampleUserId,
      });

      const newPost = await Post.findOne({
        where: { id: post.id },
        attributes: [
          "id", "title", "thumbnail", "context", "createdAt",
          [sequelize.literal("(SELECT COUNT(*) FROM Likes where Likes.postId=post.id)"), "likersCount"],
        ],
        include: {
          model: User,
          attributes: ["id", "nickname"],
        },
      });
    
      const isLiking = await Like.findOne({
        where: {
          postId: newPost.id,
          likedId: sampleUserId,
        },
      });

      return res.status(201).send({
        post: newPost,
        isLiking: isLiking ? true : false,
      });
    } catch(error) {
      console.error(error);
      return res.status(500).json({ msg: "서버 내부 에러" });
    };
  },

  editPost: async function(req, res) {
    try {
      const sampleUserId = 1;
  
      const { postId } = req.params;
  
      const { title, preview, context } = req.body;
      if(!title || !preview || !context) {
        return res.status(400).json({ msg: "제목, 내용, 미리보기 중 전달되지 않은 것이 있습니다." });
      };
  
      const prevPost = await Post.findOne({
        where: { id: postId },
      });
      if(!prevPost) { return res.status(400).json({ msg: "해당 포스트를 찾을 수 없습니다." }); };
  
      const thumbnail = ImageController.getThumbnail(context);
  
      await prevPost.update({
        title,
        thumbnail: thumbnail ? thumbnail : "",
        preview,
        context,
      });
  
      const newPost = await Post.findOne({
        where: { id: prevPost.id },
        attributes: [
          "id", "title", "thumbnail", "context", "createdAt",
          [sequelize.literal("(SELECT COUNT(*) FROM Likes where Likes.postId=postId)"), "likersCount"],
        ],
        include: {
          model: User,
          attributes: ["id", "nickname"],
        },
      });
  
      const isLiking = await Like.findOne({
        where: {
          postId: newPost.id,
          likedId: sampleUserId,
        },
      });
  
      return res.status(201).send({
        post: newPost,
        isLiking: isLiking ? true : false,
      });
    } catch(error) {
      console.error(error);
      return res.status(500).json({ msg: "서버 내부 에러" });
    };
  },

  deletePost: async function(req, res) {
    try {
      const { postId } = req.params;
  
      const isDeleted = await Post.destroy({
        where: { id: postId },
      });
      if(!isDeleted) { return res.status(400).json({ msg: "해당 포스트를 찾을 수 없습니다." }) };
  
      return res.status(200).json({ msg: "포스트를 삭제하였습니다." });
    } catch(error) {
      console.error(error);
      return res.status(500).json({ msg: "서버 내부 에러" });
    };
  },

  likePost: async function(req, res) {
    try {
      const { postId } = req.params;
      
      const sampleUserId = 1;
  
      const [like, isLiked] = await Like.findOrCreate({
        where: { postId: postId },
        defaults: {
          likedId: sampleUserId,
        }
      });
      if(!isLiked) { return res.status(400).send({ msg: "이미 좋아요를 한 포스트입니다." }); };
  
      const post = await Post.findOne({
        where: { id: postId },
        attributes: [
          [sequelize.literal("(SELECT COUNT(*) FROM Likes where Likes.postId=postId)"), "likersCount"],
        ],
      });
  
      return res.status(201).send({
        post: post,
        isLiking: true,
      });
    } catch(error) {
      console.error(error);
      return res.status(500).json({ msg: "서버 내부 에러" });
    };
  },

  dislikePost: async function(req, res) {
    try {
      const { postId } = req.params;
  
      const sampleUserId = 1;
  
      await Like.destroy({
        where: {
          postId: postId,
          likedId: sampleUserId,
        },
      });
  
      const post = await Post.findOne({
        where: { id: postId },
        attributes: [
          [sequelize.literal("(SELECT COUNT(*) FROM Likes where Likes.postId=postId)"), "likersCount"],
        ],
      });
  
      return res.status(201).send({
        post: post,
        isLiking: false,
      });
    } catch(error) {
      console.error(error);
      return res.status(500).json({ msg: "서버 내부 에러" });
    };
  },
};