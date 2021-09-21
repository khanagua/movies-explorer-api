// const { celebrate, Joi } = require('celebrate');
// const moviesRouter = require('express').Router();
// const { method } = require('../utils/method');

// const {
//   getSavedMovies,
//   addMovie,
//   deleteMovie,
// } = require('../controllers/movies');

// // возвращает все сохранённые пользователем фильмы
// moviesRouter.get('/', getSavedMovies);

// // создаёт фильм с переданными в теле данными
// moviesRouter.post('/',
//   celebrate({
//     body: Joi.object().keys({
//       country: Joi.string().required(),
//       director: Joi.string().required(),
//       duration: Joi.number().required(),
//       year: Joi.string().required(),
//       description: Joi.string().required(),
//       image: Joi.string().required().custom(method),
//       trailer: Joi.string().required().custom(method),
//       thumbnail: Joi.string().required().custom(method),
//       movieId: Joi.string().required(),
//       nameRU: Joi.string().required(),
//       nameEN: Joi.string().required(),
//     }),
//   }),
//   addMovie);

// // удаляет сохранённый фильм по id
// moviesRouter.delete('/:moviesId',
//   celebrate({
//     params: Joi.object().keys({
//       moviesId: Joi.string().hex().length(24),
//     }),
//   }),
//   deleteMovie);

// module.exports = moviesRouter;
