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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const sqlite3_1 = __importDefault(require("sqlite3"));
const uuid_1 = require("uuid");
//import fs from "fs";
const storage_1 = require("@google-cloud/storage");
const sqlite_1 = require("sqlite");
const config_1 = __importDefault(require("./config"));
const log_1 = __importDefault(require("./log"));
class Files {
    constructor() {
        this.init();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.db = (0, sqlite_1.open)({
                filename: path_1.default.join(config_1.default.DB_PATH, 'db.db'),
                driver: sqlite3_1.default.Database,
            });
            this.storage = new storage_1.Storage({
                projectId: "sharekitten",
                keyFilename: config_1.default.GCLOUD_CRED,
            });
            this.bucket = this.storage.bucket((config_1.default.DEVMODE ? "staging." : "") + "sharekitten.appspot.com");
        });
    }
    resetDb() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (yield this.db).run("DROP TABLE IF EXISTS files");
            yield (yield this.db).run("CREATE TABLE files (id TEXT NOT NULL, filename TEXT NOT NULL, uploaded INTEGER NOT NULL, isPublic BOOLEAN NOT NULL CHECK (isPublic IN (0, 1)))");
        });
    }
    saveAs(filename, path, isPublic) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = (0, uuid_1.v4)();
            (yield this.db).run("INSERT INTO files VALUES (?, ?, ?, ?)", [id, filename, Date.now(), isPublic ? 1 : 0]);
            this.bucket.upload(path, {
                destination: id,
            });
            return id;
        });
    }
    downloadLink(id, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const destination = `/tmp/${id}`;
            yield this.bucket.file(id).download({
                destination,
            });
            callback(destination);
            fs_1.default.unlink(id, (err) => {
                if (err)
                    log_1.default.error(err);
                log_1.default.msg(`Deleted temporary file ${destination}`);
            });
        });
    }
    nameOf(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let results = yield (yield this.db).all("SELECT * FROM files WHERE id = ?", [id]);
            if (results && results[0])
                return results[0].filename;
            return null;
        });
    }
    getPublic(page) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.db).all("SELECT * FROM files WHERE isPublic = 1 ORDER BY uploaded DESC LIMIT ?, ?", [page * config_1.default.PERPAGE, config_1.default.PERPAGE]);
        });
    }
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            (yield this.db).run("DELETE FROM files");
            this.bucket.deleteFiles({ force: true });
        });
    }
}
exports.default = new Files;
//# sourceMappingURL=files.js.map