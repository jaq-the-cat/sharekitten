import 'dotenv/config';

export default {
  GB_PER_TIME: 6,
  TIME: 6,
  PERPAGE: 30,

  PORT: process.env.PORT || 5000,
  DB_PATH: process.env.SHAREKITTEN_DB_PATH || "/tmp/",
  GCLOUD_CRED: process.env.GCLOUD_CRED!,
  //FILE_PATH: process.env.SHAREKITTEN_FILE_PATH || "/tmp/",
  DEVMODE: process.env.NODE_ENV !== "production",
}
