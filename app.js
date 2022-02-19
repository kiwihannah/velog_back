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
const commentRouter = require("./routes/comment");

// connect DataBase
const db = require('./models');
db.sequelize
  .sync()
  .then(() => {
    console.log('Velog DB 연결 성공...');
  })
  .catch(console.error);
app.listen(3000, () => { console.log('server listening on 3000'); });

router.get('/', (req, res) => { res.send('Team #3 clone coding proj'); });

app.use("/api/post", postRouter);
app.use("/api/post/:postId/comment", commentRouter);

