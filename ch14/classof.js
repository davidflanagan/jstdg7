function classof(o) {
    return Object.prototype.toString.call(o).slice(8,-1);
}

classof(null)       // => "Null"
classof(undefined)  // => "Undefined"
classof(1)          // => "Number"
classof(10n**100n)  // => "BigInt"
classof("")         // => "String"
classof(false)      // => "Boolean"
classof(Symbol())   // => "Symbol"
classof({})         // => "Object"
classof([])         // => "Array"
classof(/./)        // => "RegExp"
classof(()=>{})     // => "Function"
classof(new Map())  // => "Map"
classof(new Set())  // => "Set"
classof(new Date()) // => "Date"

class Range {
    get [Symbol.toStringTag]() { return "Range"; }
    // the rest of this class is omitted here
}
let r = new Range(1, 10);
Object.prototype.toString.call(r)   // => "[object Range]"
classof(r)                          // => "Range"
