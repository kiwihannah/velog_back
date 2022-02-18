module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define("like", {
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    charset: "utf8",
    collate: "utf8_general_ci",
  });

  Like.associate = (db) => {
    db.Like.belongsTo(db.Post);  // 각 좋아요는 하나의 포스트에만 속한다.
  };

  return Like;
};