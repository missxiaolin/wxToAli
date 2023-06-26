import { Wx2Ant } from "./scr/index";
const path = require("path");
let configpath = path.resolve(__dirname, "./src/config/index.txt");

const options = {
    configpath
}

const wx2Ant = new Wx2Ant(options)