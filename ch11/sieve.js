// Return the largest prime smaller than n, using the sieve of Eratosthenes
function sieve(n) {
    let a = new Uint8Array(n+1);         // a[x] will be 1 if x is composite
    let max = Math.floor(Math.sqrt(n));  // Don't do factors higher than this
    let p = 2;                           // 2 is the first prime
    while(p <= max) {                    // For primes less than max
        for(let i = 2*p; i <= n; i += p) // Mark multiples of p as composite
            a[i] = 1;
        while(a[++p]) /* empty */;       // The next unmarked index is prime
    }
    while(a[n]) n--;                     // Loop backward to find the last prime
    return n;                            // And return it
}
