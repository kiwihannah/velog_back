const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();
const router = express.Router();

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
app.use('/api', bodyParser.json(), router);

app.listen(3000, () => {
  console.log('서버가 켜졌어요!');
});

morgan('dev');