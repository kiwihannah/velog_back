const express = require('express');
const router = express.Router();
const authMiddlleware = require('../middlewares/auth-middleware');

// controllers
const UserController = require("../controllers/UserController");


// 회원가입
router.post('/user/signin', UserController.CreateUser.post);

// 로그인 구현
router.post('/user/login', UserController.UserLogIn.post);

// 사용자인증 미들웨어
router.get('/user/me', authMiddlleware, UserController.UserConfirm.get);

// 회원삭제
router.delete('/user/delUser', authMiddlleware, UserController.DeleteUser.delete);

// 회원수정
router.patch('/user/editUser', authMiddlleware, UserController.Usermodification.patch);

module.exports = router;