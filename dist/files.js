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
const uuid_1 = require("uuid");
//import fs from "fs";
const storage_1 = require("@google-cloud/storage");
const config_1 = __importDefault(require("./config"));
const log_1 = __importDefault(require("./log"));
class Files {
    constructor() {
        this.init();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.storage = new storage_1.Storage({
                projectId: "sharekitten",
                keyFilename: config_1.default.GCLOUD_CRED,
            });
            this.bucket = this.storage.bucket((config_1.default.DEVMODE ? "staging." : "") + "sharekitten.appspot.com");
        });
    }
    saveAs(filename, path, isPublic) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = (isPublic ? "P" : "N") + (0, uuid_1.v4)();
            yield this.bucket.upload(path, {
                destination: id,
                metadata: {
                    metadata: {
                        "SKname": filename,
                        "SKuploaded": Date.now(),
                    }
                }
            }).catch((e) => {
                log_1.default.error(e);
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
        });
    }
    nameOf(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.bucket.file(id).getMetadata())[0].metadata.SKname;
        });
    }
    getPublic(page) {
        return __awaiter(this, void 0, void 0, function* () {
            const [files] = yield this.bucket.getFiles({
                prefix: "P",
            });
            const ffIndex = page * config_1.default.PERPAGE; // index of the first file in the page (page 0 * 20 = element 0; page 1 * 20 = element 20; page 2 * 20 = element 40, ...)
            files.forEach((file) => {
                console.log(file.metadata.metadata);
            });
            return files.slice(ffIndex, ffIndex + config_1.default.PERPAGE - 1); // dont include last item because it's also on the next page
        });
    }
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            this.bucket.deleteFiles({ force: true }).catch((e) => {
                log_1.default.error(e);
            });
        });
    }
}
exports.default = new Files;
//# sourceMappingURL=files.js.map