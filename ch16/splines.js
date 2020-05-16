const threads = require("worker_threads");

// The worker_threads module exports the boolean isMainThread property.
// This property is true when Node is running the main thread and it is
// false when Node is running a worker. We can use this fact to implement
// the main and worker threads in the same file.
if (threads.isMainThread) {
    // If we're running in the main thread, then all we do is export
    // a function. Instead of performing a computationally intensive
    // task on the main thread, this function passes the task to a worker
    // and returns a Promise that will resolve when the worker is done.
    module.exports = function reticulateSplines(splines) {
        return new Promise((resolve,reject) => {
            // Create a worker that loads and runs this same file of code.
            // Note the use of the special __filename variable.
            let reticulator = new threads.Worker(__filename);

            // Pass a copy of the splines array to the worker
            reticulator.postMessage(splines);

            // And then resolve or reject the Promise when we get
            // a message or error from the worker.
            reticulator.on("message", resolve);
            reticulator.on("error", reject);
        });
    };
} else {
    // If we get here, it means we're in the worker, so we register a
    // handler to get messages from the main thread. This worker is designed
    // to only receive a single message, so we register the event handler
    // with once() instead of on(). This allows the worker to exit naturally
    // when its work is complete.
    threads.parentPort.once("message", splines => {
        // When we get the splines from the parent thread, loop
        // through them and reticulate all of them.
        for(let spline of splines) {
            // For the sake of example, assume that spline objects usually
            // have a reticulate() method that does a lot of computation.
            spline.reticulate ? spline.reticulate() : spline.reticulated = true;
        }

        // When all the splines have (finally!) been reticulated
        // pass a copy back to the main thread.
        threads.parentPort.postMessage(splines);
    });
}
