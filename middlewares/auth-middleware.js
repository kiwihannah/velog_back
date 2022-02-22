const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();

module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    const [tokenTpye, tokenValue] = authorization.split(' ');

    if (tokenTpye !== 'Bearer') {
        res.status(401).send({
            msg: '로그인 후 사용하세요.',
        });
        return;
    }

    try {
        const { nickname } = jwt.verify(tokenValue, process.env.SECRET_KEY);
        User.findOne({ where: { nickname }}).then((user) => {
                res.locals.user = user;
                next();
            });
    } catch (error) {
        res.status(401).send({
            msg: '잘못된 접근입니다.',
        });
        return;
    }
};
