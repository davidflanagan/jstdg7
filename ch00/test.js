let uniqueInteger = (function () { // Define and invoke
    let counter = 0; // Private state of function below 
    return function() { return counter++; };
}());
console.log(uniqueInteger()) // => 0 
console.log(uniqueInteger()) // => 1