export default (
  element: Node,
  allChars: any[],
  cursor: Node,
  newCursorPosition: number
): void => {
  let nodeToInsertBefore = allChars[newCursorPosition - 1];

  element = nodeToInsertBefore?.parentNode || element;

  element.insertBefore(cursor, nodeToInsertBefore || null);
};
