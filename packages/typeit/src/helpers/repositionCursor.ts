import { CURSOR_CLASS } from "../constants";
import select from "./select";

// Trying to see if it's worth wrapping the word in a temporary wrapper.
const findPreviousSpace = (cursor) => {
  let n = cursor.previousSibling;

  let isSpace = (node) => {
    let value = node?.nodeValue || "";

    return / /.test(value);
  }

  while(n && !isSpace(n)) {
    console.log("hi");
    n = n.previousSibling;
  }

  return n;
}

export default (
  element: Node,
  allChars: any[],
  newCursorPosition: number
): void => {  
  let nodeToInsertBefore = allChars[newCursorPosition - 1];
  let cursor = select(`.${CURSOR_CLASS}`, element);
  element = nodeToInsertBefore?.parentNode || element;

  findPreviousSpace(cursor);
  
  element.insertBefore(cursor as any, nodeToInsertBefore || null);
};
