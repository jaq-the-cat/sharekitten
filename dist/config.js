"use strict";
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
exports.default = {
    GB_PER_PERSON: Number.parseInt((_a = process.env.SHAREKITTEN_GB) !== null && _a !== void 0 ? _a : "2"),
    HR_PER_PERSON: Number.parseInt((_b = process.env.SHAREKITTEN_HR) !== null && _b !== void 0 ? _b : "6"),
    PERPAGE: Number.parseInt((_c = process.env.PERPAGE) !== null && _c !== void 0 ? _c : "30"),
    PORT: process.env.PORT || 5000,
    DB_PATH: process.env.SHAREKITTEN_PATH || "/tmp/",
    FILE_PATH: process.env.SHAREKITTEN_FPATH || "/tmp/",
    DEVMODE: process.env.NODE_ENV == "production" ? true : false,
};
//# sourceMappingURL=config.js.map