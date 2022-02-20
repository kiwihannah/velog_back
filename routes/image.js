const express = require("express");
const fs = require("fs");

// controllers
const ImageController = require("../controllers/ImageController");

const router = express.Router();

// create imgaes folder for local image upload
try {
  fs.accessSync('images');
} catch(error) {
  console.log('images 폴더가 없습니다. 새로 생성합니다.');
  fs.mkdirSync('images');
};

// 이미지 업로드 POST /api/image
router.post("/", ImageController.upload.single("image"), ImageController.uploadImageInLocal);

module.exports = router;