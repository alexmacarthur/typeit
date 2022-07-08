import { CURSOR_WRAPPER_CLASS } from "../constants";
import { El } from "../types";
import { walkElementNodes } from "./chunkStrings";
import createElement from "./createElement";
import createTextNode from "./createTextNode";
import toArray from "./toArray";

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

// Returns a boolean indicating if the cursor's animation 
// is due for a restart after DOM nodes have been moved.
let createCursorWrapper = (cursor: El) => {
  let wrapper = cursor.closest(`.${CURSOR_WRAPPER_CLASS}`);
  let element = cursor.parentElement;
  let allChars = toArray(walkElementNodes(element, false, true));

  let findCharacterIndex = (n) => {
    let index = allChars.findIndex((c) => c.isSameNode(n));

    return Math.min(Math.max(index, 0), allChars.length);
  }

  let previousSpaceIndex = findCharacterIndex(
    findNearbySpace(cursor, "previous")
  );

  let nextSpaceIndex = findCharacterIndex(findNearbySpace(cursor, "next"));
  let charactersToWrap = allChars.slice(previousSpaceIndex, nextSpaceIndex + 1);

  // Maybe wrap the cursor next to its previous sibling
  // to avoid line-break and cursor alignment issues.
  if(charactersToWrap.length && cursor.nextSibling && cursor.previousSibling) {
    let placeholder = createTextNode("");
    cursor.previousSibling.before(placeholder);

    let wordWrap = createElement("span");
    wordWrap.innerText = "\u200B"
    wordWrap.classList.add(CURSOR_WRAPPER_CLASS);

    charactersToWrap.forEach(char => {
      wordWrap.append(char);
    });

    placeholder.replaceWith(wordWrap);
  }
};

export default createCursorWrapper;
