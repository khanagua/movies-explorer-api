require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const helmet = require('helmet');
const { mongodbOptions, URLMongodb, corsOptions } = require('./utils/config');
const { limiter } = require('./utils/rateLimit');
const router = require('./routes/index');
const { errorsMiddlewares } = require('./middlewares/errorsMiddlewares');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000, MONGO, NODE_ENV } = process.env;
const app = express();

app.use(requestLogger);
app.use(limiter);
app.use(cookieParser());
mongoose.connect(
  NODE_ENV !== 'production' ? URLMongodb : MONGO,
  mongodbOptions,
);
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

app.use(router);
app.use(errorLogger); // логгер ошибок библиотеки winston
app.use(errors()); // обработчик ошибок celebrate
app.use(errorsMiddlewares); // централизованный обработчик ошибок

app.listen(PORT);
