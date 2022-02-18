module.exports = (sequelize, DataTypes) => {
  const SubComment = sequelize.define("subcomment", {
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
    }
  }, {
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
  });

  SubComment.associate = (db) => {
    db.SubComment.belongsTo(db.Comment);  // 대댓글은 하나의 댓글에만 속할 수 있다.
  };

  return SubComment;
};