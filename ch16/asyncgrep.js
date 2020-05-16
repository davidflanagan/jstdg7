// Read lines of text from the source stream, and write any lines
// that match the specified pattern to the destination stream.
async function grep(source, destination, pattern, encoding="utf8") {
    // Set up the source stream for reading strings, not Buffers
    source.setEncoding(encoding);

    // Set an error handler on the destination stream in case standard
    // output closes unexpectedly (when piping output to `head`, e.g.)
    destination.on("error", err => process.exit());

    // The chunks we read are unlikely to end with a newline, so each will
    // probably have a partial line at the end. Track that here
    let incompleteLine = "";

    // Use a for/await loop to asynchronously read chunks from the input stream
    for await (let chunk of source) {
        // Split the end of the last chunk plus this one into lines
        let lines = (incompleteLine + chunk).split("\n");
        // The last line is incomplete
        incompleteLine = lines.pop();
        // Now loop through the lines and write any matches to the destination
        for(let line of lines) {
            if (pattern.test(line)) {
                destination.write(line + "\n", encoding);
            }
        }
    }
    // Finally, check for a match on any trailing text.
    if (pattern.test(incompleteLine)) {
        destination.write(incompleteLine + "\n", encoding);
    }
}

let pattern = new RegExp(process.argv[2]);   // Get a RegExp from command line.
grep(process.stdin, process.stdout, pattern) // Call the async grep() function.
    .catch(err => {                          // Handle asynchronous exceptions.
        console.error(err);
        process.exit();
    });
