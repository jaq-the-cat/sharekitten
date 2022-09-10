import 'dotenv/config';

export default {
  PORT: process.env.PORT || 5000,
  DB_PATH: process.env.SHAREKITTEN_PATH || "/tmp/",
  FILE_PATH: process.env.SHAREKITTEN_FPATH || "/tmp/",
  DEV: true
}
