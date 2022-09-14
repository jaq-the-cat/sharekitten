"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("./config"));
class SizeLimit {
    constructor() {
        this._limit = { firstRequestTime: 0, kbUploaded: 0 };
    }
    addOrReset(now) {
        this._limit = {
            firstRequestTime: now,
            kbUploaded: 0,
        };
    }
    canUpload(bytes, now) {
        // diff in hours
        const diff = (now - this._limit.firstRequestTime) / 1000 / 60 / 60;
        // if over Xh since first request
        if (diff > config_1.default.TIME) {
            this.addOrReset(now);
            return true;
        }
        // if less than Xh since first request and less than XGB
        return this._limit.kbUploaded + bytes / 1024 < config_1.default.GB_PER_TIME * 1024 * 1024;
    }
    addSize(bytes) {
        // bytes / 1024 = kilobytes
        this._limit.kbUploaded += (bytes / 1024);
    }
    size() {
        return this._limit.kbUploaded;
    }
    percentageUsed() {
        return `${((this._limit.kbUploaded / 1024 / 1024 * 100) / config_1.default.GB_PER_TIME).toFixed(2)}%`;
    }
}
exports.default = new SizeLimit;
//# sourceMappingURL=sizelimit.js.map