export default (
  element: Node,
  allChars: any[],
  cursor: Node,
  cursorPosition: number
): void => {
  // Guarantee that the new cursor position is never greater than
  // the number of characters we're dealing with.
  let characterIndex = Math.min(cursorPosition, allChars.length);

  let nodeToInsertBefore = allChars[characterIndex - 1];

  element = nodeToInsertBefore?.parentNode || element;

  element.insertBefore(cursor, nodeToInsertBefore || null);
};
