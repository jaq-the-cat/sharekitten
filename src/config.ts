import 'dotenv/config';

export default {
  PORT: process.env.PORT || 5000,
  PATH: process.env.SHARECAT_PATH || "/tmp/",
  DEV: true
}
