import 'dotenv/config';

export default {
  GB_PER_PERSON: 2,
  HR_PER_PERSON: 6,
  PERPAGE: 30,

  PORT: process.env.PORT || 5000,
  DB_PATH: process.env.SHAREKITTEN_DB_PATH || "/tmp/",
  FILE_PATH: process.env.SHAREKITTEN_FILE_PATH || "/tmp/",
  DEVMODE: process.env.NODE_ENV == "production" ? true : false,
}
