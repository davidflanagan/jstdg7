function readOnlyProxy(o) {
    function readonly() { throw new TypeError("Readonly"); }
    return new Proxy(o, {
        set: readonly,
        defineProperty: readonly,
        deleteProperty: readonly,
        setPrototypeOf: readonly,
    });
}

let o = { x: 1, y: 2 };    // Normal writable object
let p = readOnlyProxy(o);  // Readonly version of it
p.x                        // => 1: reading properties works
p.x = 2;                   // !TypeError: can't change properties
delete p.y;                // !TypeError: can't delete properties
p.z = 3;                   // !TypeError: can't add properties
p.__proto__ = {};          // !TypeError: can't change the prototype
