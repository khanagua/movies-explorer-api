require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const { celebrate, Joi, errors } = require('celebrate');
const rateLimit = require('express-rate-limit');
// const { method } = require('./utils/method');
const userRouter = require('./routes/users');
// const movieRouter = require('./routes/movies');
const { authMiddlewares } = require('./middlewares/authMiddlewares');
const { errorsMiddlewares } = require('./middlewares/errorsMiddlewares');
const { login, addUser } = require('./controllers/users');
const NotFoundError = require('./errors/not-found-error');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

const { PORT = 3000 } = process.env;
const app = express();

app.use(requestLogger);

app.use(limiter);

app.use(cookieParser());

mongoose.connect('mongodb://localhost:27017/moviedb', {
  useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
  useUnifiedTopology: true,
});

const corsWhitelist = [
  'https://movies.khanagua.nomoredomains.club',
  'api.movies.khanagua.nomoredomains.club',
  'https://localhost:3000',
];

app.use(cors({
  credentials: true,
  origin: corsWhitelist,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(helmet());

// роуты, не требующие авторизации,
app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }), login,
);
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }), addUser,
);

// роуты, которым авторизация нужна
app.use('/users', authMiddlewares, userRouter);
// app.use('/movies', authMiddlewares, movieRouter);

app.use('*', () => {
  throw new NotFoundError('Такой страницы не существует');
});
//
app.use(errorLogger); // логгер ошибок библиотеки winston
app.use(errors()); // обработчик ошибок celebrate
app.use(errorsMiddlewares); // централизованный обработчик ошибок

app.listen(PORT);
