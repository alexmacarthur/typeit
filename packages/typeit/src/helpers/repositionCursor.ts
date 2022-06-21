import { CURSOR_CLASS } from "../constants";
import createElement from "./createElement";
import select from "./select";

// Trying to see if it's worth wrapping the word in a temporary wrapper.
const findNearbySpace = (cursor, sibling: `previous` | `next`): Node => {
  let siblingMethod = `${sibling}Sibling`;
  let n = cursor;

  let isSpace = (node) => {
    let value = node?.nodeValue || "";

    return / /.test(value);
  };

  while (n && !isSpace(n)) {
    n = n[siblingMethod];
  }

  if (!n) {
    return sibling === "next"
      ? cursor.parentElement.lastChild
      : cursor.parentElement.firstChild;
  }

  return n;
};

export default (
  element: Node,
  allChars: any[],
  newCursorPosition: number
): void => {
  let findCharacterIndex = (n) => allChars.findIndex((c) => c.isSameNode(n));
  let nodeToInsertBefore = allChars[newCursorPosition - 1];
  let cursor = select(`.${CURSOR_CLASS}`, element);
  element = nodeToInsertBefore?.parentNode || element;

  let previousSpaceIndex = findCharacterIndex(
    findNearbySpace(cursor, "previous")
  );

  let nextSpaceIndex = findCharacterIndex(findNearbySpace(cursor, "next"));

  let charactersToWrap = allChars
    .slice(nextSpaceIndex, previousSpaceIndex);

  if (charactersToWrap.length) {
    let charactersToWrapWithCursor = charactersToWrap.map((c) => {
      return c.nextSibling?.isSameNode(cursor)
        ? [c, c.nextSibling]
        : c;
    });

    console.log(charactersToWrapWithCursor);

    // let wordWrap = charactersToWrap.reduce((wrapper, character) => {
    //   wrapper.prepend(character);
    //   return wrapper;
    // }, createElement('span'));
    // charactersToWrap[0].replaceWith(wordWrap);
  }

  element.insertBefore(cursor as any, nodeToInsertBefore || null);
};
