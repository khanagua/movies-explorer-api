const { Joi } = require('celebrate');
const { method } = require('./method');

module.exports.VALIDATION_OPTIONS = {
  signin: {
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  },
  signup: {
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  },
  addMovie: {
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string().required().custom(method),
      trailer: Joi.string().required().custom(method),
      thumbnail: Joi.string().required().custom(method),
      movieId: Joi.number().required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
    }),
  },
  deleteMovie: {
    params: Joi.object().keys({
      movieId: Joi.string().hex().length(24),
    }),
  },
  updateUser: {
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().required().email(),
    }),
  },
};
