const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");

const app = express();
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hi!");
});
app.use("/api", bodyParser.json(), router);
    
app.listen(3000, () => {
  console.log("서버가 켜졌어요!");
});