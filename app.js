require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const { errors } = require('celebrate');
const rateLimit = require('express-rate-limit');
const router = require('./routes/index');
// const { method } = require('./utils/method');
const { errorsMiddlewares } = require('./middlewares/errorsMiddlewares');
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

app.use(router);
app.use(errorLogger); // логгер ошибок библиотеки winston
app.use(errors()); // обработчик ошибок celebrate
app.use(errorsMiddlewares); // централизованный обработчик ошибок

app.listen(PORT);
