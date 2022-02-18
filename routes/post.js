const express = require("express");

const router = express.Router();

router.get("/", async(req, res, next) => {
  try {
    return res.status(201).json({
      msg: 'hello'
    })
  } catch(error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;