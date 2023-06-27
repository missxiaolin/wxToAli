import { Wx2Ant } from "./src/index";
const path = require("path");
let configpath = path.resolve(__dirname, "./src/config/index.txt");
let dir = path.resolve(__dirname, "./wx");

const options = {
    configpath,
    dir
}

new Wx2Ant(options)