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
exports.initdb = void 0;
const uuid_1 = require("uuid");
const path_1 = __importDefault(require("path"));
const config_1 = __importDefault(require("./config"));
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
let db = (0, sqlite_1.open)({
    filename: path_1.default.join(config_1.default.DB_PATH, 'db.db'),
    driver: sqlite3_1.default.Database,
});
function initdb() {
    return __awaiter(this, void 0, void 0, function* () {
        (yield db).run("CREATE TABLE files (id text, filename text)");
    });
}
exports.initdb = initdb;
class Files {
    save(filename) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = (0, uuid_1.v4)();
            (yield db).run("INSERT INTO files VALUES (?, ?)", [id, filename]);
            return id;
        });
    }
    filename(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let results = yield (yield db).all("SELECT * FROM files WHERE id = ?", [id]);
            return results[0].filename;
        });
    }
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            (yield db).run("DELETE FROM files");
        });
    }
}
exports.default = new Files();
//# sourceMappingURL=files.js.map