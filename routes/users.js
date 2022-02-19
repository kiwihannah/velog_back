const express = require('express');
const { User } = require('../models')
const jwt = require('jsonwebtoken');
const router = express.Router();


// 회원가입
router.post('/user/signin', async (req, res) => {
    try {
        const { nickname, password, confirmPassword } = req.body;
        if (password !== confirmPassword) {
            res.status(400).send({
                msg: "비밀번호를 확인해주세요.",
            });
            return;
        }
        if(nickname===password) {
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

        await User.create({ nickname, password });

        res.status(201).send({
            msg:"회원가입에 성공하셨습니다."
        });
    } catch (err) {
        res.status(400).send({
            msg: "요청한 형식이 올바르지 않습니다.",
        });
    }
});

// // 로그인 구현
// router.post('/user/login', async (req, res) => {
//     try {
//         const { nickname, password } = req.body;

//         const user = await User.findOne({ where: { nickname, password } });
        

//         if (!user) {
//             res.status(400).send({
//                 errorMessage: "닉네임 또는 패스워드가 잘못됐습니다."
//             });
//             return;
//         };
//         if(nickname===password) {
//             res.status(400).send({
//                 errorMessage: "닉네임과 비밀번호가 같습니다."
//             });
//             return;
//         }

//         const token = jwt.sign({ nickname: user.nickname }, "seungho-scret-key");
//         res.send({
//             token,
//         });
//     } catch (error) {
//         res.status(400).send({
//             errorMessage: "요청한 형식이 올바르지 않습니다.",
//         });
//     }
// });


module.exports = router;