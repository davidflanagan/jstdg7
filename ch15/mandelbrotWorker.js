// This is a simple worker that receives a message from its parent thread,
// performs the computation described by that message and then posts the
// result of that computation back to the parent thread.
onmessage = function(message) {
    // First, we unpack the message we received:
    //  - tile is an object with width and height properties. It specifies the
    //    size of the rectangle of pixels for which we will be computing
    //    Mandelbrot set membership.
    //  - (x0, y0) is the point in the complex plane that corresponds to the
    //    upper-left pixel in the tile.
    //  - perPixel is the pixel size in both the real and imaginary dimensions.
    //  - maxIterations specifies the maximum number of iterations we will
    //    perform before deciding that a pixel is in the set.
    const {tile, x0, y0, perPixel, maxIterations} = message.data;
    const {width, height} = tile;

    // Next, we create an ImageData object to represent the rectangular array
    // of pixels, get its internal ArrayBuffer, and create a typed array view
    // of that buffer so we can treat each pixel as a single integer instead of
    // four individual bytes. We'll store the number of iterations for each
    // pixel in this iterations array. (The iterations will be transformed into
    // actual pixel colors in the parent thread.)
    const imageData = new ImageData(width, height);
    const iterations = new Uint32Array(imageData.data.buffer);

    // Now we begin the computation. There are three nested for loops here.
    // The outer two loop over the rows and columns of pixels, and the inner
    // loop iterates each pixel to see if it "escapes" or not. The various
    // loop variables are the following:
    // - row and column are integers representing the pixel coordinate.
    // - x and y represent the complex point for each pixel: x + yi.
    // - index is the index in the iterations array for the current pixel.
    // - n tracks the number of iterations for each pixel.
    // - max and min track the largest and smallest number of iterations
    //   we've seen so far for any pixel in the rectangle.
    let index = 0, max = 0, min=maxIterations;
    for(let row = 0, y = y0; row < height; row++, y += perPixel) {
        for(let column = 0, x = x0; column < width; column++, x += perPixel) {
            // For each pixel we start with the complex number c = x+yi.
            // Then we repeatedly compute the complex number z(n+1) based on
            // this recursive formula:
            //    z(0) = c
            //    z(n+1) = z(n)^2 + c
            // If |z(n)| (the magnitude of z(n)) is > 2, then the
            // pixel is not part of the set and we stop after n iterations.
            let n;             // The number of iterations so far
            let r = x, i = y;  // Start with z(0) set to c
            for(n = 0; n < maxIterations; n++) {
                let rr = r*r, ii = i*i; // Square the two parts of z(n).
                if (rr + ii > 4) {      // If |z(n)|^2 is > 4 then
                    break;              // we've escaped and can stop iterating.
                }
                i = 2*r*i + y;          // Compute imaginary part of z(n+1).
                r = rr - ii + x;        // And the real part of z(n+1).
            }
            iterations[index++] = n;    // Remember # iterations for each pixel.
            if (n > max) max = n;       // Track the maximum number we've seen.
            if (n < min) min = n;       // And the minimum as well.
        }
    }

    // When the computation is complete, send the results back to the parent
    // thread. The imageData object will be copied, but the giant ArrayBuffer
    // it contains will be transferred for a nice performance boost.
    postMessage({tile, imageData, min, max}, [imageData.data.buffer]);
};
