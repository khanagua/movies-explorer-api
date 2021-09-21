const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { ERROR_NAME } = require('../errors/errors');
const BadRequestError = require('../errors/bad-request-error');
const ConflictRequestError = require('../errors/conflict-request-error');
const NotFoundError = require('../errors/not-found-error');
const UnauthorizedError = require('../errors/unauthorized-error');

const options = {
  new: true, // обработчик then получит на вход обновлённую запись
  runValidators: true, // данные будут валидированы перед изменением
  upsert: false, // если пользователь не найден, он будет создан
};

// создает пользователя
const addUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => res.status(200).send({
      name: user.name,
      _id: user._id,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === ERROR_NAME.validation) {
        next(new BadRequestError('Переданы некорректные или неполные данные пользователя'));
      }
      if (err.name === 'MongoError' && err.code === 11000) {
        next(new ConflictRequestError('Пользователь с такой почтой уже существует'));
      }
      next(err);
    });
};

// обновляет профиль
const updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    options,
  )
    .orFail(new Error(ERROR_NAME.notValidId))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message === ERROR_NAME.notValidId) {
        next(new NotFoundError('Пользователь не найден'));
      }
      switch (err.name) {
        case ERROR_NAME.validation:
          next(new BadRequestError('Переданы некорректные или неполные данные'));
          break;
        case ERROR_NAME.cast:
          next(new BadRequestError('Пользователь не найден'));
          break;
        default:
          next(err);
      }
    });
};

// авторизация пользователя
const login = (req, res, next) => {
  const { email, password } = req.body;
  const { NODE_ENV, JWT_SECRET } = process.env;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'life-is-an-adventure,not-a-misery',
        { expiresIn: '7d' },
      );
      res
        .cookie('jwt', token, {
          maxAge: 3600000,
          httpOnly: true,
          // sameSite: true,
        })
        .status(200)
        .send({ message: 'Куки авторизации отправлены' });
    })
    .catch((err) => {
      if (err.message === 'IncorrectData') {
        next(new UnauthorizedError('Неправильная почта или пароль'));
      }
      next(err);
    });
};

// возвращает информацию о пользователе (email и имя)
const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === ERROR_NAME.cast) {
        next(new BadRequestError('Пользователь не найден'));
      }
      next(err);
    });
};

// разлогиневат пользователя
const logout = (req, res) => {
  res.clearCookie('jwt');
  res.status(201).send({ message: 'Вы успешно вышли из аккаунта' });
};

module.exports = {
  addUser,
  updateUser,
  login,
  getUser,
  logout,
};
