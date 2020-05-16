const fs = require("fs");
const util = require("util");
const pfs = { readFile: util.promisify(fs.readFile) };

async function readConfigFile(path) {
    let text = await pfs.readFile(path, "utf-8");
    return JSON.parse(text);
}
