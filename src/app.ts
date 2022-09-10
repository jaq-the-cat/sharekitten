import express from "express";
import rateLimit from "express-rate-limit";
import fileUpload, {UploadedFile} from "express-fileupload";
import { engine } from "express-handlebars";

import sizelimit from './sizelimit';
import config from "./config";
import log from "./log";
import path from "path";
import files from "./files";

log.devMode = config.DEV;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests
  standardHeaders: true,
});

export const app = express();
app.engine('.hbs', engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', './views');
app.use(express.json());
app.use(fileUpload());
app.use(express.static('public/'))
app.set('trust proxy', true);

app.use(limiter);
app.use((req, _res, next) => {
  log.msg(`(${req.method}) ${req.ip} => ${req.path}`);
  next();
});

app.get("/", (_req, res) => res.render("index"));
app.get("/upload", (_req, res) => res.render("index"));
app.get("/upload/nofile", (req, res) => {
  if ('id' in req.query) {
    res.render("nofile", {id: req.query.id});
    return;
  }
  res.redirect("/");
});
app.get("/upload/ratelimit", (req, res) => {
  if ('ip' in req.query)
    log.warn(`${req.ip} IS BEING RATE LIMITED`);
  res.render("ratelimit")
});

app.get("/upload/:id", async (req, res) => {
  const filename = await files.filename(req.params.id);
  if (filename) {
    res.download(path.join(config.FILE_PATH, req.params.id), filename);
    log.msg(`Downloading ${filename}`);
    return;
  }
  log.warn(`COULDN'T FIND ${req.params.id}`);
  res.redirect(`/upload/nofile?id=${req.params.id}`);
});

app.post("/upload", async (req, res) => {
  if (!req.files || !('upload' in files)) {
    log.warn("NO FILES");
    res.redirect("/");
    return;
  }
  const file = req.files.upload as UploadedFile;
  if (sizelimit.userCanUpload(file.size, req.ip, Date.now())) {
    // Read user data and add to size limiter
    sizelimit.addSize(req.ip, file.size);
    const kbUploaded = sizelimit.size(req.ip);
    log.msg(`Uploaded: ${kbUploaded}KB, ${kbUploaded/1024}MB, ${kbUploaded/1024/1024}GB`);
    log.msg(`${req.ip} has uploaded ${file.size/1024/1024}MB`);

    // Save file
    const id = await files.save(file.name);
    file.mv(path.join(config.FILE_PATH, id));
    log.msg(`UPLOADED FILE: ${file.name} -> ${id}`);
    res.render("index", { url: `/upload/${id}` });
  } else {
    res.redirect("/upload/ratelimit");
  }
});

const PORT = config.PORT;
app.listen(PORT, () => {
  log.msg(`sharekitten running on ${PORT}`);
});
