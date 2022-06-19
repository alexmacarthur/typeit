import { CURSOR_CLASS } from "../constants";
import select from "./select";

export default (
  element: Node,
  allChars: any[],
  newCursorPosition: number
): void => {  
  let nodeToInsertBefore = allChars[newCursorPosition - 1];
  let cursor = select<Node>(`.${CURSOR_CLASS}`, element);
  element = nodeToInsertBefore?.parentNode || element;

  if(nodeToInsertBefore) {
    return nodeToInsertBefore.before(cursor);
  }

  (element as Element).append(cursor);
};
