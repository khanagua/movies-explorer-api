const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const userRouter = require('./users');
const movieRouter = require('./movies');
const { authMiddlewares } = require('../middlewares/authMiddlewares');
const { login, addUser, logout } = require('../controllers/users');
const NotFoundError = require('../errors/not-found-error');

// роуты, не требующие авторизации,
router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }), login,
);
router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }), addUser,
);

router.post('/signout', logout);

// роуты, которым авторизация нужна
router.use('/users', authMiddlewares, userRouter);
router.use('/movies', authMiddlewares, movieRouter);

router.use('*', authMiddlewares, () => {
  throw new NotFoundError('Такой страницы не существует');
});

module.exports = router;
