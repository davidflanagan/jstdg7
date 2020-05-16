// Return the plain-text content of element e, recursing into child elements.
// This method works like the textContent property
function textContent(e) {
    let s = "";                        // Accumulate the text here
    for(let child = e.firstChild; child !== null; child = child.nextSibling) {
        let type = child.nodeType;
        if (type === 3) {              // If it is a Text node
            s += child.nodeValue;      // add the text content to our string.
        } else if (type === 1) {       // And if it is an Element node
            s += textContent(child);   // then recurse.
        }
    }
    return s;
}
