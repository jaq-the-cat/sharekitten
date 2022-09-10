import config from './config';

type uploads = {
  firstRequestTime: number,
  kbUploaded: number,
};

class SizeLimit {
  _limit: {[id: string]: uploads} = {};

  addOrReset(id: string, now: number): void {
    this._limit[id] = {
      firstRequestTime: now,
      kbUploaded: 0,
    };
  }

  userCanUpload(bytes: number, id: string, now: number): boolean {
    if (!(id in this._limit)) {
      this.addOrReset(id, now);
      return true;
    };

    // diff in hours
    const diff = (now - this._limit[id].firstRequestTime) / 1000 / 60 / 60;
    // if over Xh since first request
    if (diff > config.HR_PER_PERSON) {
      this.addOrReset(id, now);
      return true;
    }
    // if less than Xh since first request and less than XGB
    return this._limit[id].kbUploaded + bytes/1024 < config.GB_PER_PERSON*1024*1024;
  }

  addSize(id: string, bytes: number): void {
    if (!(id in this._limit)) {
      return;
    }
    // bytes / 1024 = kilobytes
    this._limit[id].kbUploaded += (bytes / 1024);
  }

  size(id: string): number {
    if (id in this._limit)
      return this._limit[id].kbUploaded;
    return 0;
  }

  percentageUsed(id: string): string {
    if (id in this._limit)
      return `${((this._limit[id].kbUploaded/1024/1024*100) / config.GB_PER_PERSON).toFixed(2)}%`;
    return "0%";
  }
}

export default new SizeLimit;
