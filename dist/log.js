"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const reset = "\x1b[0m";
const fgyellow = "\x1b[33m";
const fgred = "\x1b[31m";
class Logger {
    constructor() {
        this.devMode = true;
        this.logFile = "/tmp/sharekitten_log.txt";
        this.errFile = "/tmp/sharekitten_err.txt";
    }
    msg(s) {
        console.log(`[MSG] ${s}`);
        if (!this.devMode) {
            fs_1.default.appendFileSync(this.logFile, `${s}\n`);
        }
    }
    warn(s) {
        console.error(`${fgyellow}[WRN]${reset} ${s.toString()}`);
        if (!this.devMode) {
            fs_1.default.appendFileSync(this.logFile, `${s}\n`);
            fs_1.default.appendFileSync(this.errFile, `${s}\n`);
        }
    }
    error(s) {
        console.error(`${fgred}[ERR]${reset} ${s}`);
        if (!this.devMode) {
            fs_1.default.appendFileSync(this.logFile, `${s}\n`);
            fs_1.default.appendFileSync(this.errFile, `${s}\n`);
        }
    }
}
exports.default = new Logger;
//# sourceMappingURL=log.js.map