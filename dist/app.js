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
const config_1 = __importDefault(require("./config"));
const express_1 = __importDefault(require("express"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const log_1 = __importDefault(require("./log"));
const path_1 = __importDefault(require("path"));
const express_handlebars_1 = require("express-handlebars");
const files_1 = __importDefault(require("./files"));
log_1.default.devMode = config_1.default.DEV;
exports.app = (0, express_1.default)();
exports.app.engine('.hbs', (0, express_handlebars_1.engine)({ extname: '.hbs' }));
exports.app.set('view engine', '.hbs');
exports.app.set('views', './views');
exports.app.use(express_1.default.json());
exports.app.use((0, express_fileupload_1.default)());
exports.app.use(express_1.default.static('public/'));
exports.app.use((req, _res, next) => {
    log_1.default.msg(`(${req.method}) ${req.ip} => ${req.path}`);
    next();
});
exports.app.get("/", (req, res) => res.render("index"));
exports.app.get("/upload/nofile", (req, res) => res.render("nofile", { id: req.query.id }));
exports.app.get("/upload/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filename = yield files_1.default.filename(req.params.id);
    if (filename) {
        res.download(path_1.default.join(config_1.default.FILE_PATH, req.params.id), filename);
        log_1.default.msg(`Downloading ${filename}`);
        return;
    }
    log_1.default.warn(`COULDN'T FIND ${req.params.id}`);
    res.redirect(`/upload/nofile?id=${req.params.id}`);
}));
exports.app.post("/upload", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.files) {
        log_1.default.warn("No files");
        res.redirect("/");
    }
    else {
        const file = req.files.upload;
        const id = yield files_1.default.save(file.name);
        file.mv(path_1.default.join(config_1.default.FILE_PATH, id));
        log_1.default.msg(`UPLOADED FILE: ${file.name} -> ${id}`);
        res.render("index", { url: `/upload/${id}` });
    }
}));
const PORT = config_1.default.PORT;
exports.app.listen(PORT, () => {
    log_1.default.msg(`sharekitten running on ${PORT}`);
});
//# sourceMappingURL=app.js.map