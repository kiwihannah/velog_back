const multer = require("multer");
const path = require("path");
const fs = require("fs");

// create imgaes folder for local image upload
try {
  fs.accessSync('images');
} catch(error) {
  console.log('images 폴더가 없습니다. 새로 생성합니다.');
  fs.mkdirSync('images');
};

module.exports = {
  api: {
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
    // uploadS3: 
  },

  upload: {
    image: (req, res) => {
      res.status(200).json(req.file.filename);
    },
    
    imageOnS3: (req, res) => {
      res.status(200).json(req.file.location);
    },
  },
}