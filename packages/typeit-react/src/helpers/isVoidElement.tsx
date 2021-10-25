// Reference: https://html.spec.whatwg.org/multipage/syntax.html#elements-2
const voidElements: string[] = [
    "area", 
    "base", 
    "br", 
    "col",
    "embed",
    "hr", 
    "img",
    "input",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr"
];

/**
 * Given the name of an element, check if it's one of the "void" elements, 
 * which cannot contain any children.
 */
export default (elementName: string): boolean => {
    return voidElements.indexOf(elementName.toLowerCase()) > -1;
}
