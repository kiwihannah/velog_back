module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    'post',
    {
      title: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      thumbnail: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      context: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      desc: {
        type: DataTypes.STRING(60),
        allowNull: false,
      },
    },
    thumbnail: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    context: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    preview: {
      type: DataTypes.STRING(60),
      allowNull: false,
    }
  );

  Post.associate = (db) => {
    db.Post.belongsTo(db.User);  // 하나의 포스트에는 한 명의 작성자만 있다.
    db.Post.hasMany(db.Comment);  // 하나의 포스트에는 여러 개의 코멘트가 있다.
    db.Post.hasMany(db.Like); // 하나의 포스트에는 여러 개의 좋아요가 있다.
  };

  return Post;
};
