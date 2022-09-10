"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        //diff in hours
        //let diff = (now - this._limit[id].firstRequestTime) / 1000 / 60 / 60;
        // diff in seconds
        let diff = (now - this._limit[id].firstRequestTime) / 1000;
        // if less than 2h since first request and less than 2GB
        //if (diff < 2 && (this._limit[id].kbUploaded + bytes/1024) < 2_097_152) {
        if (diff < 30 && (this._limit[id].kbUploaded + bytes / 1024) < 2097152) {
            return true;
            //} else if (diff > 2) {
        }
        else if (diff > 30) {
            this.addOrReset(id, now);
            return true;
        }
        return false;
    }
    addSize(id, bytes) {
        if (!(id in this._limit)) {
            return;
        }
        // bytes / 1024 = kilobytes
        this._limit[id].kbUploaded += (bytes / 1024);
    }
    size(id) {
        return this._limit[id].kbUploaded;
    }
}
exports.default = new SizeLimit;
//# sourceMappingURL=sizelimit.js.map