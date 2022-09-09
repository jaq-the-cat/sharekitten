"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
var Log;
(function (Log) {
    Log[Log["Debug"] = 0] = "Debug";
    Log[Log["Warning"] = 1] = "Warning";
    Log[Log["Error"] = 2] = "Error";
})(Log || (Log = {}));
class Logger {
    constructor() {
        this.devMode = false;
        this.logFile = "/tmp/sharekitten_log.txt";
        this.errFile = "/tmp/sharekitten_err.txt";
    }
    msg(s) {
        console.log(`[MSG] ${s}`);
        if (!this.devMode) {
            fs_1.default.appendFileSync(this.logFile, s);
        }
    }
    warn(s) {
        console.error(`[WRN] ${s}`);
        if (!this.devMode) {
            fs_1.default.appendFileSync(this.logFile, s);
            fs_1.default.appendFileSync(this.errFile, s);
        }
    }
    error(s) {
        console.error(`[ERR] ${s}`);
        if (!this.devMode) {
            fs_1.default.appendFileSync(this.logFile, s);
            fs_1.default.appendFileSync(this.errFile, s);
        }
    }
    log(logType, s) {
        switch (logType) {
            case Log.Debug:
                this.msg(s);
                break;
            case Log.Warning:
                this.warn(s);
                break;
            case Log.Error:
                this.error(s);
                break;
        }
    }
}
exports.default = new Logger;
//# sourceMappingURL=log.js.map