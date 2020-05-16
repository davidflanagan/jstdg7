function words(s) {
    var r = /\s+|$/g;                     // Match one or more spaces or end
    r.lastIndex = s.match(/[^ ]/).index;  // Start matching at first nonspace
    return {                              // Return an iterable iterator object
        [Symbol.iterator]() {             // This makes us iterable
            return this;
        },
        next() {                          // This makes us an iterator
            let start = r.lastIndex;      // Resume where the last match ended
            if (start < s.length) {       // If we're not done
                let match = r.exec(s);    // Match the next word boundary
                if (match) {              // If we found one, return the word
                    return { value: s.substring(start, match.index) };
                }
            }
            return { done: true };        // Otherwise, say that we're done
        }
    };
}

[...words(" abc def  ghi! ")] // => ["abc", "def", "ghi!"]
