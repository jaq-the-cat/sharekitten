import 'dotenv/config';

export default {
  GB_PER_PERSON: Number.parseInt(process.env.SHAREKITTEN_GB ?? "2"),
  HR_PER_PERSON: Number.parseInt(process.env.SHAREKITTEN_HR ?? "6"),

  PORT: process.env.PORT || 5000,
  DB_PATH: process.env.SHAREKITTEN_PATH || "/tmp/",
  FILE_PATH: process.env.SHAREKITTEN_FPATH || "/tmp/",
  DEVMODE: process.env.NODE_ENV == "production" ? true : false,
}
