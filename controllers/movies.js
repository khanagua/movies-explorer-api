const Movie = require('../models/movie');
const { ERROR_NAME } = require('../errors/errors');
const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');
const { MESSAGES } = require('../utils/messages');

// возвращает все сохранённые пользователем фильмы
const getSavedMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send(movies))
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
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === ERROR_NAME.validation) {
        next(new BadRequestError(MESSAGES.incorrectDataMovie));
      } else {
        next(err);
      }
    });
};

// удаляет сохранённый фильм по id
const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(new Error(ERROR_NAME.notValidId))
    // eslint-disable-next-line consistent-return
    .then((movie) => {
      if (movie.owner.toString() !== req.user._id.toString()) {
        next(new ForbiddenError(MESSAGES.noRightsFilm));
      } else {
        return Movie.findByIdAndDelete(req.params.movieId)
          .then(() => res.send({ message: MESSAGES.movieDeleted }));
      }
    })
    .catch((err) => {
      if (err.name === ERROR_NAME.cast) {
        next(new BadRequestError(MESSAGES.movieNotFound));
      }
      switch (err.message) {
        case ERROR_NAME.notValidId:
          next(new NotFoundError(MESSAGES.movieNotFound));
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
