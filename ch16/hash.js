const fs = require("fs");
const crypto = require("crypto");

// Compute a sha256 hash of the contents of the named file and pass the
// hash (as a string) to the specified error-first callback function.
function sha256(filename, callback) {
    let input = fs.createReadStream(filename); // The data stream.
    let hasher = crypto.createHash("sha256");  // For computing the hash.

    input.on("readable", () => {         // When there is data ready to read
        let chunk;
        while(chunk = input.read()) {    // Read a chunk, and if non-null,
            hasher.update(chunk);        // pass it to the hasher,
        }                                // and keep looping until not readable
    });
    input.on("end", () => {              // At the end of the stream,
        let hash = hasher.digest("hex"); // compute the hash,
        callback(null, hash);            // and pass it to the callback.
    });
    input.on("error", callback);         // On error, call callback
}

// Here's a simple command-line utility to compute the hash of a file
sha256(process.argv[2], (err, hash) => { // Pass filename from command line.
    if (err) {                           // If we get an error
        console.error(err.toString());   // print it as an error.
    } else {                             // Otherwise,
        console.log(hash);               // print the hash string.
    }
});
