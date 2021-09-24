const router = require('express').Router();
const { celebrate } = require('celebrate');
const userRouter = require('./users');
const movieRouter = require('./movies');
const { authMiddlewares } = require('../middlewares/authMiddlewares');
const { login, addUser, logout } = require('../controllers/users');
const NotFoundError = require('../errors/not-found-error');
const { VALIDATION_OPTIONS } = require('../utils/validation');
const { MESSAGES } = require('../utils/messages');

// роуты, не требующие авторизации,
router.post('/signin', celebrate(VALIDATION_OPTIONS.signin), login);
router.post('/signup', celebrate(VALIDATION_OPTIONS.signup), addUser);

router.post('/signout', logout);

// роуты, которым авторизация нужна
router.use('/users', authMiddlewares, userRouter);
router.use('/movies', authMiddlewares, movieRouter);

router.use('*', authMiddlewares, () => {
  throw new NotFoundError(MESSAGES.pageNotExist);
});

module.exports = router;
