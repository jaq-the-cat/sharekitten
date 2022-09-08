"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const config_1 = __importDefault(require("./config"));
const express_1 = __importDefault(require("express"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const log_1 = __importDefault(require("./log"));
log_1.default.devMode = config_1.default.DEV;
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
exports.app.use((0, express_fileupload_1.default)());
exports.app.use((req, _res, next) => {
    log_1.default.msg(`(${req.method}) ${req.ip} => ${req.path}`);
    next();
});
exports.app.get("/", (req, res) => {
    res.send("hello :)");
});
exports.app.post("/submit", (req, res) => {
    if (!req.files) {
        log_1.default.warn("No files");
    }
    else {
        log_1.default.msg(`Uploaded: ${req.files}`);
    }
    res.send(true);
});
const PORT = config_1.default.PORT;
exports.app.listen(PORT, () => {
    log_1.default.msg(`sharecat running on ${PORT}`);
});
//# sourceMappingURL=app.js.map