const sequelize = require("sequelize");
// tables
const { Comment } = require("../models");

module.exports = {
  create: {
    comment: async (data, callback) => {
      try {
        if(!data.commentBody) {
          return callback({ msg: '댓글 내용이 없습니다.' });
        };
        console.log(data.commentId , data.commentBody, data.isDeleted,  data.userId, data.postId)
        await Comment.create({
          parentsId: Number(data.commentId) !== 0 ? data.commentId : 0,
          commentBody : data.commentBody,
          isDeleted : data.isDeleted,
          userId : data.userId, // 임시
          postId : data.postId // 임시
        });
        callback({ msg: '댓글이 등록되었습니다.' });
      } catch(error) {
        console.error(error);
        callback({ msg: '새 댓글 작성 서버 내부 에러' });
      }
    },
  },

  update: {
    patch: async (data, callback) => {
      try {
        if(!data.commentBody) {
          return callback({ msg: '댓글 내용이 없습니다.' });
        };
        const prevComment = await Comment.findOne({ where: { id: data.commentId } });
        if(!prevComment) {
          return callback({ msg: "해당 댓글을 찾을 수 없습니다." })
        }else {
          await prevComment.update({ commentBody });
          return callback({ msg: '해당 댓글을 수정했습니다.' });
        }
      } catch(error) {
        console.error(error);
        callback({ msg: '댓글 수정 서버 내부 에러' });
      }
    },
  },

  get: {
    commentsParents: async (data, callback) => {
      try {
        const comments = await Comment.findOne({
          where: {
            postId : data.postId,
            isDeleted : data.isDeleted
          },
          include: {
            model: User,
            attributes: ["id", "nickname"],
          }
        });
        callback(comments);
      } catch(error) {
        console.error(error);
        callback({ msg: "댓글 가져오기 에러" });
      };
    },

    commentsChild: async (data, callback) => {
      try {
        const comments = await Comment.findOne({
          where: {
            parentsId : data.commentId,
            isDeleted : data.isDeleted
          },
          include: {
            model: User,
            attributes: ["id", "nickname"],
          }
        });
        callback(comments);
      } catch(error) {
        console.error(error);
        callback({ msg: "댓글 가져오기 에러" });
      };
    },

  },

  delete: {
    patch: async (data, callback) => {
      try {
        const prevComment = await Comment.findOne({ where: { id: data.commentId } });
        if(!prevComment) {
           return callback({ msg: "해당 댓글을 찾을 수 없습니다." })
        } else {
          await prevComment.update({ isDeleted : data.isDeleted });
          return callback({ msg: '댓글을 삭제하였습니다.' });
        }
      } catch(error) {
        console.error(error);
        callback({ msg: "댓글 삭제 에러" });
      }
    },
  },
};