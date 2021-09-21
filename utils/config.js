const mongodbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const URLMongodb = 'mongodb://localhost:27017/moviesdb';

const corsWhitelist = [
  'https://movies.khanagua.nomoredomains.club',
  'api.movies.khanagua.nomoredomains.club',
  'https://localhost:3000',
];

const corsOptions = {
  credentials: true,
  origin: corsWhitelist,
};

const secretPhrase = 'life-is-an-adventure,not-a-misery';

module.exports = {
  mongodbOptions,
  URLMongodb,
  corsWhitelist,
  corsOptions,
  secretPhrase,
};
