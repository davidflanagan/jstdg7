function write(stream, chunk, callback) {
    // Write the specified chunk to the specified stream
    let hasMoreRoom = stream.write(chunk);

    // Check the return value of the write() method:
    if (hasMoreRoom) {                  // If it returned true, then
        setImmediate(callback);         // invoke callback asynchronously.
    } else {                            // If it returned false, then
        stream.once("drain", callback); // invoke callback on drain event.
    }
}
