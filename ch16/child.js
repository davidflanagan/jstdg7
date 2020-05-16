// Wait for messages from our parent process
process.on("message", message => {
    // When we receive one, do a calculation and send the result
    // back to the parent.
    process.send({hypotenuse: Math.hypot(message.x, message.y)});
});
