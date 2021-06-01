import { Element } from "../types";

export default (
  element: Node,
  allChars: any[],
  cursor: Node,
  cursorPosition: number
): void => {
  if (!cursor) {
    return;
  }

  let characterIndex = cursorPosition > allChars.length
    ? allChars.length
    : cursorPosition;

  let nodeToInsertBefore = allChars[characterIndex - 1];

  element = nodeToInsertBefore?.parentNode || element;

  element.insertBefore(cursor, nodeToInsertBefore || null);
};
