module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
    nickname: {
      type: DataTypes.STRING(10),
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    }
  }, {
    charset: "utf8",
    collate: "utf8_general_ci",
  });

  User.associate = (db) => {
    db.User.hasMany(db.Post);  // 한 유저는 여러 개의 포스트를 작성할 수 있다.
    db.User.belongsToMany(db.Post, { through: "Likes", as: "Liked" });  // 한 유저는 여러 개의 포스트에 좋아요를 할 수 있다.
    db.User.hasMany(db.Comment);  // 한 유저는 여러 개의 코멘트를 작성할 수 있다.
    db.User.hasMany(db.SubComment);  // 한 유저는 여러 개의 대댓글을 작성할 수 있다.
  };

  return User;
};