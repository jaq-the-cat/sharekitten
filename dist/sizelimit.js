"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("./config"));
class SizeLimit {
    constructor() {
        this._limit = {};
    }
    addOrReset(id, now) {
        this._limit[id] = {
            firstRequestTime: now,
            kbUploaded: 0,
        };
    }
    userCanUpload(bytes, id, now) {
        if (!(id in this._limit)) {
            this.addOrReset(id, now);
            return true;
        }
        ;
        // diff in hours
        const diff = (now - this._limit[id].firstRequestTime) / 1000 / 60 / 60;
        // if over Xh since first request
        if (diff > config_1.default.HR_PER_PERSON) {
            this.addOrReset(id, now);
            return true;
        }
        // if less than Xh since first request and less than XGB
        return this._limit[id].kbUploaded + bytes / 1024 < config_1.default.GB_PER_PERSON * 1024 * 1024;
    }
    addSize(id, bytes) {
        if (!(id in this._limit)) {
            return;
        }
        // bytes / 1024 = kilobytes
        this._limit[id].kbUploaded += (bytes / 1024);
    }
    size(id) {
        if (id in this._limit)
            return this._limit[id].kbUploaded;
        return 0;
    }
    percentageUsed(id) {
        if (id in this._limit)
            return `${((this._limit[id].kbUploaded / 1024 / 1024 * 100) / config_1.default.GB_PER_PERSON).toFixed(2)}%`;
        return "0%";
    }
}
exports.default = new SizeLimit;
//# sourceMappingURL=sizelimit.js.map