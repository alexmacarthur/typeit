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
let createCursorWrapper = (cursor: El | void): boolean => {
  if(!cursor) return false;

  let element = cursor.parentElement;
  let allChars = toArray(walkElementNodes(element, false, true));

  let findCharacterIndex = (n) => {
    let index = allChars.findIndex((c) => c.isSameNode(n));

    return Math.min(Math.max(index, 0), allChars.length);
  }

  let beginningOfWord = findCharacterIndex(
    findNearbySpace(cursor, "previous")
  ) + 1;

  let endOfWord = findCharacterIndex(findNearbySpace(cursor, "next")) - 1;

  let charactersToWrap = allChars.slice(beginningOfWord, endOfWord + 1);

  console.log("===");
  charactersToWrap.forEach(c => console.log(c));
  console.log("===");
  
  // Maybe wrap the cursor next to its previous sibling
  // to avoid line-break and cursor alignment issues.
  if(charactersToWrap.length && cursor.nextSibling && cursor.previousSibling) {
    let placeholder = createTextNode("");

    // is this correct? Or do 
    charactersToWrap[0].before(placeholder);

    let wordWrap = createElement("span");

    wordWrap.innerText = ""
    wordWrap.classList.add(CURSOR_WRAPPER_CLASS);

    charactersToWrap.forEach(char => {
      wordWrap.append(char);
    });

    placeholder.replaceWith(wordWrap);

    return true;
  }

  return false;
};

export default createCursorWrapper;
