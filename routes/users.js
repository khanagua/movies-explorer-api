const { celebrate, Joi } = require('celebrate');
const userRouter = require('express').Router();

const { getUser, updateUser } = require('../controllers/users');

// возвращает информацию о пользователе (email и имя)
userRouter.get('/me', getUser);

// обновляет информацию о пользователе (email и имя)
userRouter.patch('/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().required(),
    }),
  }),
  updateUser);

module.exports = userRouter;
