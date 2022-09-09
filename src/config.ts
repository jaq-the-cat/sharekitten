import 'dotenv/config';

export default {
  PORT: process.env.PORT || 5000,
  DB_PATH: process.env.SHAREKITTEN_DB_PATH || "/tmp/",
  PATH: process.env.SHAREKITTEN_PATH || "/tmp/",
  DEV: true
}
