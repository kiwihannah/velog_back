const express = require("express");

const router = express.Router();

// controllers
const ImageController = require("../controllers/ImageController");

// middlewares
const authMiddleware = require("../middlewares/auth-middleware");

// 이미지 업로드 POST /api/image
router.post("/", authMiddleware, ImageController.api.upload.single("image"), ImageController.upload.image);

module.exports = router;