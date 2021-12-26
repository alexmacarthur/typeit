import { CURSOR_CLASS } from "../contants";
import select from "./select";

export default (
  element: Node,
  allChars: any[],
  newCursorPosition: number
): void => {  
  let nodeToInsertBefore = allChars[newCursorPosition - 1];
  let cursor = select(`.${CURSOR_CLASS}`, element);
  element = nodeToInsertBefore?.parentNode || element;
  
  element.insertBefore(cursor as any, nodeToInsertBefore || null);
};
