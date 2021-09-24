const { MESSAGES } = require('../utils/messages');

module.exports.errorsMiddlewares = (err, req, res, next) => {
  const { statusCode = 500, message = MESSAGES.errorServer } = err;
  res
    .status(statusCode)
    .send({ message });
  next();
};
