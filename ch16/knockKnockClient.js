// Connect to the joke port (6789) on the server named on the command line
let socket = require("net").createConnection(6789, process.argv[2]);
socket.pipe(process.stdout);              // Pipe data from the socket to stdout
process.stdin.pipe(socket);               // Pipe data from stdin to the socket
socket.on("close", () => process.exit()); // Quit when the socket closes.
