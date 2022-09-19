"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
            //fs.appendFileSync(this.logFile, `${s}`);
        }
    }
    warn(s) {
        console.error(`${fgyellow}[WRN]${reset} ${s.toString()}`);
        if (!this.devMode) {
            //fs.appendFileSync(this.logFile, `${s}`);
            //fs.appendFileSync(this.errFile, `${s}`);
        }
    }
    error(s) {
        console.error(`${fgred}[ERR]${reset} ${s}`);
        if (!this.devMode) {
            //fs.appendFileSync(this.logFile, `${s}`);
            //fs.appendFileSync(this.errFile, `${s}`);
        }
    }
}
exports.default = new Logger;
//# sourceMappingURL=log.js.map