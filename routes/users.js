const express = require('express');
const { User } = require('../models')
const bcrypt = require('bcrypt');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const authMiddlleware = require('../middlewares/auth-middleware');
const router = express.Router();
require('dotenv').config();

// Joi
const postUsersSchemas = Joi.object({
    nickname: Joi.string()
        .required()
        .pattern(new RegExp('^[a-zA-Z0-9가-힣]{3,30}$')),
    password: Joi.string()
        .required()
        .pattern(new RegExp('^(?=.*[0-9])(?=.*[a-zA-Z])[0-9a-zA-Z!@#$%^&*]{8,30}$')),
    confirmPassword: Joi.string()
        .required()
        .pattern(new RegExp('^(?=.*[0-9])(?=.*[a-zA-Z])[0-9a-zA-Z!@#$%^&*]{8,30}$')),
});



// 회원가입
router.post('/user/signin', async (req, res) => {
    try {
        const { nickname, password, confirmPassword } = await postUsersSchemas.validateAsync(req.body);
        if (password !== confirmPassword) {
            res.status(400).send({
                msg: "비밀번호를 확인해주세요.",
            });
            return;
        }
        if (nickname === password) {
            res.status(400).send({
                msg: "닉네임과 비밀번호가 같습니다."
            });
            return;
        }

        const existUsers = await User.findAll({
            where: { nickname },
        });

        if (existUsers.length) {
            res.status(400).send({
                msg: "이미 가입된 닉네임이 있습니다.",
            })
            return;
        }

        const encryptedPassword = bcrypt.hashSync(password, 10);

        await User.create({ nickname, password: encryptedPassword });

        res.status(201).send({
            msg: "회원가입에 성공하셨습니다."
        });
    } catch (err) {
        res.status(400).send({
            msg: "요청한 형식이 올바르지 않습니다.",
        });
    }
});

// 조이
const postAuthSchemas = Joi.object({
    nickname: Joi.string()
        .required()
        .pattern(new RegExp('^[a-zA-Z0-9가-힣]{3,30}$')),
    password: Joi.string().required().pattern(new RegExp('^(?=.*[0-9])(?=.*[a-zA-Z])[0-9a-zA-Z!@#$%^&*]{8,30}$')),
});

// 로그인 구현
router.post('/user/login', async (req, res) => {
    try {
        const { nickname, password } = await postAuthSchemas.validateAsync(req.body);

        const user = await User.findOne({ where: { nickname } });

        const isPasswordSync = bcrypt.compareSync(password, user.password);


        if (!user) {
            res.status(400).send({
                msg: "닉네임 또는 패스워드가 잘못됐습니다."
            });
            return;
        };

        if (!isPasswordSync) {
            return res.status(400).send("비밀번호가 일치하지 않습니다.");
        }

        const token = jwt.sign({ nickname: user.nickname }, process.env.SECRET_KEY);
        res.send({
            token,
        });
    } catch (error) {
        res.status(400).send({
            msg: "요청한 형식이 올바르지 않습니다.",
        });
    }
});

// 사용자인증 미들웨어
router.get('/user/me', authMiddlleware, async (req, res) => {
    const { user } = res.locals;
    res.send({
        user: {
            nickname: user.nickname,
        },
    });
});


module.exports = router;