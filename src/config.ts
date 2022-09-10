import 'dotenv/config';

export default {
  GB_PER_PERSON: 2,
  HR_PER_PERSON: 6,

  PORT: process.env.PORT || 5000,
  DB_PATH: process.env.SHAREKITTEN_PATH || "/tmp/",
  FILE_PATH: process.env.SHAREKITTEN_FPATH || "/tmp/",
  DEV: true
}
