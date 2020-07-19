function clock(interval, max=Infinity) {
    // A Promise-ified version of setTimeout that we can use await with.
    // Note that this takes an absolute time instead of an interval.
    function until(time) {
        return new Promise(resolve => setTimeout(resolve, time - Date.now()));
    }

    let startTime = Date.now();  // Remember when we started
    let count = 0;               // Remember which iteration we're on

    // Return an asynchronously iterable object
    return {
        async next() {           // The next() method makes this an iterator
            if (++count > max) { // Are we done?
                return { done: true };  // Iteration result indicating done
            }
            // Figure out when the next iteration should begin,
            let targetTime = startTime + count * interval;
            // wait until that time,
            await until(targetTime);
            // and return the count value in an iteration result object.
            return { value: count };
        },
        // This method means that this iterator object is also an iterable.
        [Symbol.asyncIterator]() { return this; }
    };
}
