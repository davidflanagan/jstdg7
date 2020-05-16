// This is a simple static HTTP server that serves files from a specified
// directory. It also implements a special /test/mirror endpoint that
// echoes the incoming request, which can be useful when debugging clients.
const http = require("http");   // Use "https" if you have a certificate
const url = require("url");     // For parsing URLs
const path = require("path");   // For manipulating filesystem paths
const fs = require("fs");       // For reading files

// Serve files from the specified root directory via an HTTP server that
// listens on the specified port.
function serve(rootDirectory, port) {
    let server = new http.Server();  // Create a new HTTP server
    server.listen(port);             // Listen on the specified port
    console.log("Listening on port", port);

    // When requests come in, handle them with this function
    server.on("request", (request, response) => {
        // Get the path portion of the request URL, ignoring
        // any query parameters that are appended to it.
        let endpoint = url.parse(request.url).pathname;

        // If the request was for "/test/mirror", send back the request
        // verbatim. Useful when you need to see the request headers and body.
        if (endpoint === "/test/mirror") {
            // Set response header
            response.setHeader("Content-Type", "text/plain; charset=UTF-8");

            // Specify response status code
            response.writeHead(200);  // 200 OK

            // Begin the response body with the request
            response.write(`${request.method} ${request.url} HTTP/${
                               request.httpVersion
                           }\r\n`);

            // Output the request headers
            let headers = request.rawHeaders;
            for(let i = 0; i < headers.length; i += 2) {
                response.write(`${headers[i]}: ${headers[i+1]}\r\n`);
            }

            // End headers with an extra blank line
            response.write("\r\n");

            // Now we need to copy any request body to the response body
            // Since they are both streams, we can use a pipe
            request.pipe(response);
        }
        // Otherwise, serve a file from the local directory.
        else {
            // Map the endpoint to a file in the local filesystem
            let filename = endpoint.substring(1); // strip leading /
            // Don't allow "../" in the path because it would be a security
            // hole to serve anything outside the root directory.
            filename = filename.replace(/\.\.\//g, "");
            // Now convert from relative to absolute filename
            filename = path.resolve(rootDirectory, filename);

            // Now guess the type file's content type based on extension
            let type;
            switch(path.extname(filename))  {
            case ".html":
            case ".htm": type = "text/html"; break;
            case ".js":  type = "text/javascript"; break;
            case ".css": type = "text/css"; break;
            case ".png": type = "image/png"; break;
            case ".txt": type = "text/plain"; break;
            default:     type = "application/octet-stream"; break;
            }

            let stream = fs.createReadStream(filename);
            stream.once("readable", () => {
                // If the stream becomes readable, then set the
                // Content-Type header and a 200 OK status. Then pipe the
                // file reader stream to the response. The pipe will
                // automatically call response.end() when the stream ends.
                response.setHeader("Content-Type", type);
                response.writeHead(200);
                stream.pipe(response);
            });

            stream.on("error", (err) => {
                // Instead, if we get an error trying to open the stream
                // then the file probably does not exist or is not readable.
                // Send a 404 Not Found plain-text response with the
                // error message.
                response.setHeader("Content-Type", "text/plain; charset=UTF-8");
                response.writeHead(404);
                response.end(err.message);
            });
        }
    });
}

// When we're invoked from the command line, call the serve() function
serve(process.argv[2] || "/tmp", parseInt(process.argv[3]) || 8000);
