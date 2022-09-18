"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const express_handlebars_1 = require("express-handlebars");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const fs_1 = __importDefault(require("fs"));
const https_1 = __importDefault(require("https"));
const config_1 = __importDefault(require("./config"));
const files_1 = __importDefault(require("./files"));
const log_1 = __importDefault(require("./log"));
const sizelimit_1 = __importDefault(require("./sizelimit"));
log_1.default.devMode = config_1.default.DEVMODE;
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
});
exports.app = (0, express_1.default)();
exports.app.engine('.hbs', (0, express_handlebars_1.engine)({ extname: '.hbs' }));
exports.app.set('view engine', '.hbs');
exports.app.set('views', './views');
exports.app.use(express_1.default.json());
exports.app.use((0, express_fileupload_1.default)({
    useTempFiles: true,
}));
exports.app.use(express_1.default.static('public/'));
exports.app.set('trust proxy', true);
exports.app.use(limiter);
exports.app.use((req, _res, next) => {
    log_1.default.msg(`(${req.method}) ${req.ip} => ${req.path}`);
    next();
});
exports.app.get("/", (_req, res) => res.render("index", { used: sizelimit_1.default.percentageUsed() }));
exports.app.get("/upload", (_req, res) => res.render("index", { used: sizelimit_1.default.percentageUsed() }));
exports.app.get("/upload/nofile", (req, res) => {
    if ('id' in req.query) {
        res.render("nofile", { id: req.query.id });
        return;
    }
    res.redirect("/");
});
exports.app.get("/upload/ratelimit", (req, res) => {
    if ('ip' in req.query)
        log_1.default.warn(`${req.ip} IS BEING RATE LIMITED`);
    res.render("ratelimit");
});
exports.app.get("/download/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const filename = (_a = yield files_1.default.nameOf(req.params.id)) !== null && _a !== void 0 ? _a : req.params.id;
    files_1.default.downloadLink(req.params.id, (path) => {
        log_1.default.msg(`Downloading ${path}`);
        res.download(path, filename);
    }).catch((e) => {
        log_1.default.error(e);
        log_1.default.warn(`COULDN'T FIND ${filename !== null && filename !== void 0 ? filename : req.params.id}`);
        res.redirect(`/upload/nofile?id=${filename !== null && filename !== void 0 ? filename : req.params.id}`);
    });
}));
function msToFormattedString(msSinceEpoch) {
    const d = new Date(msSinceEpoch);
    const date = `${d.getUTCFullYear().toString().padStart(4, '0')}-${d.getUTCMonth().toString().padStart(2, '0')}-${d.getUTCDate().toString().padStart(2, '0')}`;
    const time = ` ${d.getUTCHours().toString().padStart(2, '0')}:${d.getUTCMinutes().toString().padStart(2, '0')}`;
    return `${date} ${time}`;
}
exports.app.get("/uploads", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rPage = req.query.page;
    const page = rPage ? Number.parseInt(rPage) : 0;
    res.render("publicfiles", {
        page: page,
        hasPrevious: page > 0,
        previous: page - 1,
        next: page + 1,
        files: (yield files_1.default.getPublic(page)).map((row) => {
            return {
                filename: row.filename,
                id: row.id,
                uploaded: msToFormattedString(row.uploaded),
            };
        }),
    });
}));
exports.app.post("/upload", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.files || !('upload' in req.files)) {
        log_1.default.warn("NO FILES");
        res.redirect("/");
        return;
    }
    const file = req.files.upload;
    if (sizelimit_1.default.canUpload(file.size, Date.now())) {
        // Read user data and add to size limiter
        sizelimit_1.default.addSize(file.size);
        log_1.default.msg(`${req.ip} has uploaded ${file.size / 1024}MB (${sizelimit_1.default.percentageUsed()})`);
        // Save file to Database and upload it to Storage
        const id = yield files_1.default.saveAs(file.name, file.tempFilePath, req.body.isPublic);
        log_1.default.msg(`UPLOADED ${req.body.isPublic ? 'PUBLIC' : 'PRIVATE'} FILE: ${file.name} -> ${id}`);
        res.render("index", { url: `/download/${id}`, used: sizelimit_1.default.percentageUsed() });
    }
    else {
        res.redirect("/upload/ratelimit");
    }
}));
// global error handler
exports.app.use(((err, _req, res, _next) => {
    var _a;
    log_1.default.error(err);
    res.status((_a = err.status) !== null && _a !== void 0 ? _a : 500);
    res.end();
}));
const PORT = config_1.default.PORT;
https_1.default.createServer({
    key: fs_1.default.readFileSync("server.key"),
    cert: fs_1.default.readFileSync("server.cert"),
}, exports.app).listen(PORT, () => {
    log_1.default.msg(`sharekitten running on ${PORT} with HTTPS`);
});
//# sourceMappingURL=app.js.map