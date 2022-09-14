import config from './config';

type uploads = {
  firstRequestTime: number,
  kbUploaded: number,
};

class SizeLimit {
  _limit: uploads = {firstRequestTime: 0, kbUploaded: 0};

  addOrReset(now: number): void {
    this._limit = {
      firstRequestTime: now,
      kbUploaded: 0,
    };
  }

  canUpload(bytes: number, now: number): boolean {
    // diff in hours
    const diff = (now - this._limit.firstRequestTime) / 1000 / 60 / 60;
    // if over Xh since first request
    if (diff > config.TIME) {
      this.addOrReset(now);
      return true;
    }
    // if less than Xh since first request and less than XGB
    return this._limit.kbUploaded + bytes/1024 < config.GB_PER_TIME*1024*1024;
  }

  addSize(bytes: number): void {
    // bytes / 1024 = kilobytes
    this._limit.kbUploaded += (bytes / 1024);
  }

  size(): number {
    return this._limit.kbUploaded;
  }

  percentageUsed(): string {
    return `${((this._limit.kbUploaded/1024/1024*100) / config.GB_PER_TIME).toFixed(2)}%`;
  }
}

export default new SizeLimit;
