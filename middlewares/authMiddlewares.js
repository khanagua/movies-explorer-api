const jwt = require('jsonwebtoken');
const { secretPhrase } = require('../utils/config');
const UnauthorizedError = require('../errors/unauthorized-error');
const { MESSAGES } = require('../utils/messages');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.authMiddlewares = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    next(new UnauthorizedError(MESSAGES.authorizationRequired));
  } else {
    let payload;
    try {
      payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : secretPhrase);
    } catch (err) {
      next(new UnauthorizedError(MESSAGES.authorizationRequired));
    }
    req.user = payload;
  }
  next();
};
