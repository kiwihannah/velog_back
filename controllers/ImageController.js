const multer = require("multer");
const path = require("path");

module.exports = {
  // multer for 로컬 업로드
  upload: multer({
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
  }),

  // multerS3 for S3 업로드

  // 로컬 폴더에 이미지 업로드
  uploadImageInLocal: function(req, res) {
    res.json(req.file.filename);
  },

  // S3에 이미지 업로드
  uploadImageInS3: function(req, res) {
    res.json(req.file.location);
  },
}