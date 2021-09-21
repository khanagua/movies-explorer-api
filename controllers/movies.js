const Movie = require('../models/movie');
const { ERROR_NAME } = require('../errors/errors');
const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');

// возвращает все сохранённые пользователем фильмы
const getSavedMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.status(200).send(movies))
    .catch(next);
};

// создаёт фильм с переданными в теле данными
const addMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((movie) => res.status(200).send(movie))
    .catch((err) => {
      if (err.name === ERROR_NAME.validation) {
        next(new BadRequestError('Переданы некорректные или неполные данные фильма'));
      }
      next(err);
    });
};

// удаляет сохранённый фильм по id
const deleteMovie = (req, res, next) => {
  Movie.findOneAndRemove({ movieId: req.params.movieId })
    .then(() => {
      res.status(200).send({ message: 'Фильм удален' });
    })
    .catch((err) => {
      if (err.name === ERROR_NAME.cast) {
        next(new BadRequestError('Фильм не найден'));
      }
      switch (err.message) {
        case ERROR_NAME.notValidId:
          next(new NotFoundError('Фильм не найден'));
          break;
        default:
          next(err);
      }
    });
};

module.exports = {
  getSavedMovies,
  addMovie,
  deleteMovie,
};
