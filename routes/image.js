const express = require("express");

const router = express.Router();

// controllers
const ImageController = require("../controllers/ImageController");

router.post("/", ImageController.api.upload.single("image"), ImageController.upload.image);  // 이미지 업로드 POST /api/image

module.exports = router;