/*
 * Return a Proxy object that wraps o, delegating all operations to
 * that object after logging each operation. objname is a string that
 * will appear in the log messages to identify the object. If o has own
 * properties whose values are objects or functions, then if you query
 * the value of those properties, you'll get a loggingProxy back, so that
 * logging behavior of this proxy is "contagious".
 */
function loggingProxy(o, objname) {
    // Define handlers for our logging Proxy object.
    // Each handler logs a message and then delegates to the target object.
    const handlers = {
        // This handler is a special case because for own properties
        // whose value is an object or function, it returns a proxy rather
        // than returning the value itself.
        get(target, property, receiver) {
            // Log the get operation
            console.log(`Handler get(${objname},${property.toString()})`);

            // Use the Reflect API to get the property value
            let value = Reflect.get(target, property, receiver);

            // If the property is an own property of the target and
            // the value is an object or function then return a Proxy for it.
            if (Reflect.ownKeys(target).includes(property) &&
                (typeof value === "object" || typeof value === "function")) {
                return loggingProxy(value, `${objname}.${property.toString()}`);
            }

            // Otherwise return the value unmodified.
            return value;
        },

        // There is nothing special about the following three methods:
        // they log the operation and delegate to the target object.
        // They are a special case simply so we can avoid logging the
        // receiver object which can cause infinite recursion.
        set(target, prop, value, receiver) {
            console.log(`Handler set(${objname},${prop.toString()},${value})`);
            return Reflect.set(target, prop, value, receiver);
        },
        apply(target, receiver, args) {
            console.log(`Handler ${objname}(${args})`);
            return Reflect.apply(target, receiver, args);
        },
        construct(target, args, receiver) {
            console.log(`Handler ${objname}(${args})`);
            return Reflect.construct(target, args, receiver);
        }
    };

    // We can automatically generate the rest of the handlers.
    // Metaprogramming FTW!
    Reflect.ownKeys(Reflect).forEach(handlerName => {
        if (!(handlerName in handlers)) {
            handlers[handlerName] = function(target, ...args) {
                // Log the operation
                console.log(`Handler ${handlerName}(${objname},${args})`);
                // Delegate the operation
                return Reflect[handlerName](target, ...args);
            };
        }
    });

    // Return a proxy for the object using these logging handlers
    return new Proxy(o, handlers);
}
