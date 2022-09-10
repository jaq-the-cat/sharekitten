"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const files_1 = __importDefault(require("./files"));
function dbi() {
    return __awaiter(this, void 0, void 0, function* () {
        if (process.argv.length != 3)
            return;
        switch (process.argv[2]) {
            case 'init':
                files_1.default.init();
                break;
            case 'clear':
                files_1.default.clear();
                break;
        }
    });
}
dbi();
//# sourceMappingURL=dbi.js.map