import { Wx2Ant } from "./src/index";
const path = require("path");
let configpath = path.resolve(__dirname, "./src/config/index.txt");

const options = {
    configpath
}

new Wx2Ant(options)