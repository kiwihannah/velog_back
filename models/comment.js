module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    'comment',
    {
      parentsId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      commentBody: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      isDeleted: {
        type: DataTypes.TEXT, //Y or N
        allowNull: false,
        default: 'N',
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
  };

  return Comment;
};
