import fs from 'fs';

enum Log {
  Debug,
  Warning,
  Error
}

class Logger {
  devMode: boolean = false;
  logFile: string = "/tmp/sharecat_log.txt";
  errFile: string = "/tmp/sharecat_err.txt";

  msg(s: string) {
    console.log(`[MSG] ${s}`);
    if (!this.devMode) {
      fs.appendFileSync(this.logFile, s);
    }
  }

  warn(s: string) {
    console.error(`[WRN] ${s}`);
    if (!this.devMode) {
      fs.appendFileSync(this.logFile, s);
      fs.appendFileSync(this.errFile, s);
    }
  }

  error(s: string) {
    console.error(`[ERR] ${s}`);
    if (!this.devMode) {
      fs.appendFileSync(this.logFile, s);
      fs.appendFileSync(this.errFile, s);
    }
  }

  log(logType: Log, s: string) {
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

export default new Logger;
