// We use a Proxy to create an object that appears to have every
// possible property, with the value of each property equal to its name
let identity = new Proxy({}, {
    // Every property has its own name as its value
    get(o, name, target) { return name; },
    // Every property name is defined
    has(o, name) { return true; },
    // There are too many properties to enumerate, so we just throw
    ownKeys(o) { throw new RangeError("Infinite number of properties"); },
    // All properties exist and are not writable, configurable or enumerable.
    getOwnPropertyDescriptor(o, name) {
        return {
            value: name,
            enumerable: false,
            writable: false,
            configurable: false
        };
    },
    // All properties are read-only so they can't be set
    set(o, name, value, target) { return false; },
    // All properties are non-configurable, so they can't be deleted
    deleteProperty(o, name) { return false; },
    // All properties exist and are non-configurable so we can't define more
    defineProperty(o, name, desc) { return false; },
    // In effect, this means that the object is not extensible
    isExtensible(o) { return false; },
    // All properties are already defined on this object, so it couldn't
    // inherit anything even if it did have a prototype object.
    getPrototypeOf(o) { return null; },
    // The object is not extensible, so we can't change the prototype
    setPrototypeOf(o, proto) { return false; },
});

identity.x                // => "x"
identity.toString         // => "toString"
identity[0]               // => "0"
identity.x = 1;           // Setting properties has no effect
identity.x                // => "x"
delete identity.x         // => false: can't delete properties either
identity.x                // => "x"
Object.keys(identity);    // !RangeError: can't list all the keys
for(let p of identity) ;  // !RangeError
