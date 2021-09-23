const { celebrate } = require('celebrate');
const userRouter = require('express').Router();
const { VALIDATION_OPTIONS } = require('../utils/validation');

const { getUser, updateUser } = require('../controllers/users');

// возвращает информацию о пользователе (email и имя)
userRouter.get('/me', getUser);

// обновляет информацию о пользователе (email и имя)
userRouter.patch('/me', celebrate(VALIDATION_OPTIONS.updateUser), updateUser);

module.exports = userRouter;
