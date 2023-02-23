"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const typo_js_1 = __importDefault(require("typo-js"));
const dictionary = new typo_js_1.default('en_US', null, null, { dictionaryPath: path_1.default.join('dictionaries') });
const output = dictionary.check('cardio');
console.log(output);
