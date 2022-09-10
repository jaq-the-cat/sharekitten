import config from "./config";
import express from "express";
import fileUpload, {UploadedFile} from "express-fileupload";
import log from "./log";
import path from "path";
import { engine } from "express-handlebars";
import files from "./files";

log.devMode = config.DEV;

export const app = express();
app.engine('.hbs', engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', './views');
app.use(express.json());
app.use(fileUpload());
app.use(express.static('public/'))

app.use((req, _res, next) => {
  log.msg(`(${req.method}) ${req.ip} => ${req.path}`);
  next();
});

app.get("/", (req, res) => res.render("index"));
app.get("/upload/nofile", (req, res) => res.render("nofile", {id: req.query.id}));

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
  if (!req.files) {
    log.warn("No files");
    res.redirect("/");
  } else {
    const file = req.files.upload as UploadedFile;
    const id = await files.save(file.name);
    file.mv(path.join(config.FILE_PATH, id));
    log.msg(`UPLOADED FILE: ${file.name} -> ${id}`);
    res.render("index", { url: `/upload/${id}` });
  }
});

const PORT = config.PORT;
app.listen(PORT, () => {
  log.msg(`sharekitten running on ${PORT}`);
});
