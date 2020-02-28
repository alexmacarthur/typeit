export default (element, allChars, cursor, cursorPosition) => {
  if (!cursor) {
    return;
  }

  let characterIndex = cursorPosition;

  // Make sure we stop when we're at the beginning of the string.
  characterIndex =
    characterIndex > allChars.length ? allChars.length : characterIndex;

  let nodeToInsertBefore = allChars[characterIndex - 1];

  element.insertBefore(cursor, nodeToInsertBefore || null);
};
