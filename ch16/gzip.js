const fs = require("fs");
const zlib = require("zlib");

function gzip(filename, callback) {
    // Create the streams
    let source = fs.createReadStream(filename);
    let destination = fs.createWriteStream(filename + ".gz");
    let gzipper = zlib.createGzip();

    // Set up the pipeline
    source
        .on("error", callback)   // call callback on read error
        .pipe(gzipper)
        .pipe(destination)
        .on("error", callback)   // call callback on write error
        .on("finish", callback); // call callback when writing is complete
}
