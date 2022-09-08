import config from './config';
import express from "express";
import fileUpload from 'express-fileupload';
import log from "./log";

log.devMode = config.DEV;

export const app = express();
app.use(express.json())
app.use(fileUpload());

app.use((req, _res, next) => {
  log.msg(`(${req.method}) ${req.ip} => ${req.path}`);
  next();
});

app.get("/", (req, res) => {
  res.send("hello :)");
});

app.post("/submit", (req, res) => {
  if (!req.files) {
    log.warn("No files");
  } else {
    log.msg(`Uploaded: ${req.files}`);
  }
  res.send(true);
});

const PORT = config.PORT;
app.listen(PORT, () => {
  log.msg(`sharecat running on ${PORT}`);
});
