const fs = require("fs");

// A streaming file copy function, using "flowing mode".
// Copies the contents of the named source file to the named destination file.
// On success, invokes the callback with a null argument. On error,
// invokes the callback with an Error object.
function copyFile(sourceFilename, destinationFilename, callback) {
    let input = fs.createReadStream(sourceFilename);
    let output = fs.createWriteStream(destinationFilename);

    input.on("data", (chunk) => {          // When we get new data,
        let hasRoom = output.write(chunk); // write it to the output stream.
        if (!hasRoom) {                    // If the output stream is full
            input.pause();                 // then pause the input stream.
        }
    });
    input.on("end", () => {                // When we reach the end of input,
        output.end();                      // tell the output stream to end.
    });
    input.on("error", err => {             // If we get an error on the input,
        callback(err);                     // call the callback with the error
        process.exit();                    // and quit.
    });

    output.on("drain", () => {             // When the output is no longer full,
        input.resume();                    // resume data events on the input
    });
    output.on("error", err => {            // If we get an error on the output,
        callback(err);                     // call the callback with the error
        process.exit();                    // and quit.
    });
    output.on("finish", () => {            // When output is fully written
        callback(null);                    // call the callback with no error.
    });
}

// Here's a simple command-line utility to copy files
let from = process.argv[2], to = process.argv[3];
console.log(`Copying file ${from} to ${to}...`);
copyFile(from, to, err => {
    if (err) {
        console.error(err);
    } else {
        console.log("done.");
    }
});
