const child_process = require("child_process");

// Start a new node process running the code in child.js in our directory
let child = child_process.fork(`${__dirname}/child.js`);

// Send a message to the child
child.send({x: 4, y: 3});

// Print the child's response when it arrives.
child.on("message", message => {
    console.log(message.hypotenuse); // This should print "5"
    // Since we only send one message we only expect one response.
    // After we receive it we call disconnect() to terminate the connection
    // between parent and child. This allows both processes to exit cleanly.
    child.disconnect();
});
