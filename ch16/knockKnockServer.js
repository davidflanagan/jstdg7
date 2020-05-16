// A TCP server that delivers interactive knock-knock jokes on port 6789.
// (Why is six afraid of seven? Because seven ate nine!)
const net = require("net");
const readline = require("readline");

// Create a Server object and start listening for connections
let server = net.createServer();
server.listen(6789, () => console.log("Delivering laughs on port 6789"));

// When a client connects, tell them a knock-knock joke.
server.on("connection", socket => {
    tellJoke(socket)
        .then(() => socket.end())  // When the joke is done, close the socket.
        .catch((err) => {
            console.error(err);    // Log any errors that occur,
            socket.end();          // but still close the socket!
        });
});

// These are all the jokes we know.
const jokes = {
    "Boo": "Don't cry...it's only a joke!",
    "Lettuce": "Let us in! It's freezing out here!",
    "A little old lady": "Wow, I didn't know you could yodel!"
};

// Interactively perform a knock-knock joke over this socket, without blocking.
async function tellJoke(socket) {
    // Pick one of the jokes at random
    let randomElement = a => a[Math.floor(Math.random() * a.length)];
    let who = randomElement(Object.keys(jokes));
    let punchline = jokes[who];

    // Use the readline module to read the user's input one line at a time.
    let lineReader = readline.createInterface({
        input: socket,
        output: socket,
        prompt: ">> "
    });

    // A utility function to output a line of text to the client
    // and then (by default) display a prompt.
    function output(text, prompt=true) {
        socket.write(`${text}\r\n`);
        if (prompt) lineReader.prompt();
    }

    // Knock-knock jokes have a call-and-response structure.
    // We expect different input from the user at different stages and
    // take different action when we get that input at different stages.
    let stage = 0;

    // Start the knock-knock joke off in the traditional way.
    output("Knock knock!");

    // Now read lines asynchronously from the client until the joke is done.
    for await (let inputLine of lineReader) {
        if (stage === 0) {
            if (inputLine.toLowerCase() === "who's there?") {
                // If the user gives the right response at stage 0
                // then tell the first part of the joke and go to stage 1.
                output(who);
                stage = 1;
            } else  {
                // Otherwise teach the user how to do knock-knock jokes.
                output('Please type "Who\'s there?".');
            }
        } else if (stage === 1) {
            if (inputLine.toLowerCase() === `${who.toLowerCase()} who?`) {
                // If the user's response is correct at stage 1, then
                // deliver the punchline and return since the joke is done.
                output(`${punchline}`, false);
                return;
            } else {
                // Make the user play along.
                output(`Please type "${who} who?".`);
            }
        }
    }
}
