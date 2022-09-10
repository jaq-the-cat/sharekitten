"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
exports.default = {
    GB_PER_PERSON: 2,
    HR_PER_PERSON: 6,
    PORT: process.env.PORT || 5000,
    DB_PATH: process.env.SHAREKITTEN_PATH || "/tmp/",
    FILE_PATH: process.env.SHAREKITTEN_FPATH || "/tmp/",
    DEV: true
};
//# sourceMappingURL=config.js.map