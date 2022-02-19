module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    'comment',
    {
      parentsId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    }
  );

  Comment.associate = (db) => {
    db.Comment.belongsTo(db.User); // 하나의 코멘트에는 한 명의 작성자만 있다.
    db.Comment.belongsTo(db.Post); // 하나의 코멘트는 하나의 포스트에는 존재할 수 있다.
    db.Comment.hasMany(db.SubComment); // 댓글에는 여러 개의 대댓글이 있을 수 있다.
  };

  return Comment;
};
