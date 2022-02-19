const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

try {
  fs.accessSync('images');
} catch(error) {
  console.log('images 폴더가 없습니다. 새로 생성합니다.');
  fs.mkdirSync('images');
};

// multer 셋팅
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, "images");
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname) // 확장자 추출(.png)
      const basename = path.basename(file.originalname, ext) // 파일 이름 추출(이름)
      done(null, basename + "_" + new Date().getTime() + ext) // 이름_1518123131.png
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});

// 이미지 업로드 POST /api/image
router.post("/", upload.single("image"), (req, res, next) => {
  res.json(req.file.filename);
});

module.exports = router;