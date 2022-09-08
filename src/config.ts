import 'dotenv/config';

export default {
  PORT: process.env.PORT || 5000,
  PATH: process.env.SHAREKITTEN_PATH || "/tmp/",
  DEV: true
}
