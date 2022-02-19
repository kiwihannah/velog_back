const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");

const app = express();
const router = express.Router();

// middlewares
app.use(morgan("dev"));
app.use(cors({ origin: "*" }));
app.use("/api", bodyParser.json(), router);

// routes
const postRouter = require("./routes/post");
const userRouter = require("./routes/users")

// connect DataBase
const db = require('./models');
db.sequelize
  .sync()
  .then(() => {
    console.log('Velog DB 연결 성공...');
  })
  .catch(console.error);

router.get('/', (req, res) => {
  res.send('Hi!');
});

app.use("/api/post", postRouter);
app.use("/api", userRouter);

app.listen(3000, () => {
  console.log('서버가 켜졌어요!');
});

morgan('dev');