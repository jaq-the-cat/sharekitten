import express, {ErrorRequestHandler} from "express";
import 'express-async-errors';
import fileUpload, {UploadedFile} from "express-fileupload";
import {engine} from "express-handlebars";
import rateLimit from "express-rate-limit";
import fs from 'fs';
import https from "https";

import config from "./config";
import files from "./files";
import log from "./log";
import sizelimit from './sizelimit';

log.devMode = config.DEVMODE;

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
app.use(fileUpload({
  useTempFiles: true,
}));
app.use(express.static('public/'))
app.set('trust proxy', true);

app.use(limiter);
app.use((req, _res, next) => {
  log.msg(`(${req.method}) ${req.ip} => ${req.path}`);
  next();
});

app.get("/", (_req, res) => res.render("index", { used: sizelimit.percentageUsed() }));
app.get("/upload", (_req, res) => res.render("index", { used: sizelimit.percentageUsed()}));
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

app.get("/download/:id", async (req, res) => {
    const filename = await files.nameOf(req.params.id) ?? req.params.id;
    files.downloadLink(req.params.id, (path) => {
      log.msg(`Downloading ${path}`);
      res.download(path, filename, {}, (_) => {
        fs.unlink(path, (err) => {
          if (err) log.error(err);
          log.msg(`Deleted temporary file ${path}`);
        });
      });
    }).catch((e) => {
      log.error(e);
      log.warn(`COULDN'T FIND ${filename ?? req.params.id}`);
      res.redirect(`/upload/nofile?id=${filename ?? req.params.id}`);
    });
});

function msToFormattedString(msSinceEpoch: number): string {
  const d = new Date(msSinceEpoch);
  const date = `${d.getUTCFullYear().toString().padStart(4, '0')}-${d.getUTCMonth().toString().padStart(2, '0')}-${d.getUTCDate().toString().padStart(2, '0')}`;
  const time = ` ${d.getUTCHours().toString().padStart(2, '0')}:${d.getUTCMinutes().toString().padStart(2, '0')}`;
  return `${date} ${time}`;
}

app.get("/uploads", async (req, res) => {
  const rPage = req.query.page;
  const page = rPage ? Number.parseInt(rPage as string) : 0;
  const publicFiles = await files.getPublic(page);
  const filesFormatted = publicFiles.map(row => {
    return {
      filename: row.metadata.metadata.SKname,
      id: row.id,
      uploaded: msToFormattedString(Date.parse(row.metadata.timeCreated)),
    };
  });
  res.render("publicfiles", {
    page: page,
    hasPrevious: page > 0,
    previous: page-1,
    next: page+1,
    files: filesFormatted,
  });
});

app.post("/upload", async (req, res) => {
  if (!req.files || !('upload' in req.files)) {
    log.warn("NO FILES");
    res.redirect("/");
    return;
  }
  const file = req.files.upload as UploadedFile;
  if (sizelimit.canUpload(file.size, Date.now())) {
    // Read user data and add to size limiter
    sizelimit.addSize(file.size);
    log.msg(`${req.ip} has uploaded ${file.size/1024}MB (${sizelimit.percentageUsed()})`);

    // Save file to Database and upload it to Storage
    const id = await files.saveAs(file.name, file.tempFilePath, req.body.isPublic);
    log.msg(`UPLOADED ${req.body.isPublic ? 'PUBLIC' : 'PRIVATE'} FILE: ${file.name} -> ${id}`);
    res.render("index", { url: `/download/${id}`, used: sizelimit.percentageUsed() });
  } else {
    res.redirect("/upload/ratelimit");
  }
});

// global error handler
app.use(((err, _req, res, _next) => {
  log.error(err);
  res.status(err.status ?? 500);
  res.end();
}) as ErrorRequestHandler);

const PORT = config.PORT;
if (config.DEVMODE) {
  app.listen(PORT, () => {
    log.msg(`sharekitten running with HTTP on ${PORT} in Debug Mode`);
  });
} else {
  https.createServer({
    key: fs.readFileSync("server.key"),
    cert: fs.readFileSync("server.cert"),
  }, app).listen(PORT, () => {
    log.msg(`sharekitten running with HTTPS on ${PORT}`);
  });
}
