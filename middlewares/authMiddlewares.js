const jwt = require('jsonwebtoken');
const { secretPhrase } = require('../utils/config');
const UnauthorizedError = require('../errors/unauthorized-error');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.authMiddlewares = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    next(new UnauthorizedError('Нужно пройти авторизацию'));
  } else {
    let payload;
    try {
      payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : secretPhrase);
    } catch (err) {
      next(new UnauthorizedError('Нужно пройти авторизацию'));
    }
    req.user = payload;
  }
  next();
};
