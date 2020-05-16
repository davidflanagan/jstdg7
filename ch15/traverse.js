// Recursively traverse the Document or Element e, invoking the function
// f on e and on each of its descendants
function traverse(e, f) {
    f(e);                             // Invoke f() on e
    for(let child of e.children) {    // Iterate over the children
        traverse(child, f);           // And recurse on each one
    }
}

function traverse2(e, f) {
    f(e);                             // Invoke f() on e
    let child = e.firstElementChild;  // Iterate the children linked-list style
    while(child !== null) {
        traverse2(child, f);          // And recurse
        child = child.nextElementSibling;
    }
}
