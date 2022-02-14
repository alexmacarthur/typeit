let updateCursorPosition = (
  steps: number,
  cursorPosition: number,
  printedCharacters: Element[]
) => {
  return Math.min(
    Math.max(cursorPosition + steps, 0),
    printedCharacters.length
  );
};

export default updateCursorPosition;
