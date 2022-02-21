const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");

const app = express();
const router = express.Router();

// 이미지 경로
app.use('/', express.static(path.join(__dirname, 'images')));

// middlewares
app.use(morgan("dev"));
app.use(cors({ origin: "*" }));
app.use("/api", bodyParser.json(), router);

// routes
const postRouter = require("./routes/post");
const userRouter = require("./routes/users")
const commentRouter = require("./routes/comment");
const imageRouter = require("./routes/image");

// connect DataBase
const db = require('./models');
db.sequelize
  .sync()
  .then(() => {
    console.log('Velog DB 연결 성공...');
  })
  .catch(console.error);

router.get('/', (req, res) => { res.send('Team #3 clone coding proj'); });

app.use("/api", postRouter);
app.use("/api", userRouter);
app.use("/api/post", commentRouter);
app.use("/api/image", imageRouter);

app.listen(3000, () => {
  console.log('서버가 켜졌어요!');
});

module.exports = app;