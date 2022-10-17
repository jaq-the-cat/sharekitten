import fs from 'fs';

const reset = "\x1b[0m";
const fgyellow = "\x1b[33m";
const fgred = "\x1b[31m";

class Logger {
  devMode: boolean = true;
  logFile: string = "/tmp/sharekitten_log.txt";
  errFile: string = "/tmp/sharekitten_err.txt";

  msg(s: any): void {
    console.log(`[MSG] ${s}`);
    if (!this.devMode) {
      fs.appendFileSync(this.logFile, `${s}\n`);
    }
  }

  warn(s: any): void {
    console.error(`${fgyellow}[WRN]${reset} ${s.toString()}`);
    if (!this.devMode) {
      fs.appendFileSync(this.logFile, `${s}\n`);
      fs.appendFileSync(this.errFile, `${s}\n`);
    }
  }

  error(s: any): void {
    console.error(`${fgred}[ERR]${reset} ${s}`);
    if (!this.devMode) {
      fs.appendFileSync(this.logFile, `${s}\n`);
      fs.appendFileSync(this.errFile, `${s}\n`);
    }
  }
}

export default new Logger;
