const { celebrate } = require('celebrate');
const moviesRouter = require('express').Router();
const { VALIDATION_OPTIONS } = require('../utils/validation');

const {
  getSavedMovies,
  addMovie,
  deleteMovie,
} = require('../controllers/movies');

// возвращает все сохранённые пользователем фильмы
moviesRouter.get('/', getSavedMovies);

// создаёт фильм с переданными в теле данными
moviesRouter.post('/', celebrate(VALIDATION_OPTIONS.addMovie), addMovie);

// удаляет сохранённый фильм по id
moviesRouter.delete('/:movieId', celebrate(VALIDATION_OPTIONS.deleteMovie), deleteMovie);

module.exports = moviesRouter;
