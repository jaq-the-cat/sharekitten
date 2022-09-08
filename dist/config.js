"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
exports.default = {
    PORT: process.env.PORT || 5000,
    PATH: process.env.SHARECAT_PATH || "/tmp/",
    DEV: true
};
//# sourceMappingURL=config.js.map