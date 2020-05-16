const stream = require("stream");

class GrepStream extends stream.Transform {
    constructor(pattern) {
        super({decodeStrings: false});// Don't convert strings back to buffers
        this.pattern = pattern;       // The regular expression we want to match
        this.incompleteLine = "";     // Any remnant of the last chunk of data
    }

    // This method is invoked when there is a string ready to be
    // transformed. It should pass transformed data to the specified
    // callback function. We expect string input so this stream should
    // only be connected to readable streams that have had
    // setEncoding() called on them.
    _transform(chunk, encoding, callback) {
        if (typeof chunk !== "string") {
            callback(new Error("Expected a string but got a buffer"));
            return;
        }
        // Add the chunk to any previously incomplete line and break
        // everything into lines
        let lines = (this.incompleteLine + chunk).split("\n");

        // The last element of the array is the new incomplete line
        this.incompleteLine = lines.pop();

        // Find all matching lines
        let output = lines                     // Start with all complete lines,
            .filter(l => this.pattern.test(l)) // filter them for matches,
            .join("\n");                       // and join them back up.

        // If anything matched, add a final newline
        if (output) {
            output += "\n";
        }

        // Always call the callback even if there is no output
        callback(null, output);
    }

    // This is called right before the stream is closed.
    // It is our chance to write out any last data.
    _flush(callback) {
        // If we still have an incomplete line, and it matches
        // pass it to the callback
        if (this.pattern.test(this.incompleteLine)) {
            callback(null, this.incompleteLine + "\n");
        }
    }
}

// Now we can write a program like 'grep' with this class.
let pattern = new RegExp(process.argv[2]); // Get a RegExp from command line.
process.stdin                              // Start with standard input,
    .setEncoding("utf8")                   // read it as Unicode strings,
    .pipe(new GrepStream(pattern))         // pipe it to our GrepStream,
    .pipe(process.stdout)                  // and pipe that to standard out.
    .on("error", () => process.exit());    // Exit gracefully if stdout closes.
