import { CURSOR_CLASS } from "../constants";
import { walkElementNodes } from "./chunkStrings";
import createElement from "./createElement";
import createTextNode from "./createTextNode";
import removeNode from "./removeNode";
import select from "./select";
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

export default (
  element: Node,
  allChars: any[],
  newCursorPosition: number
): void => {

  // Clean up!
  let existingWordWrapper = element.querySelector('.ti-wrapper');

  if(existingWordWrapper) {
    toArray(walkElementNodes(element, false, true)).forEach((child) => {
      element.insertBefore(child, existingWordWrapper);
    });

    removeNode(existingWordWrapper);
  }

  let findCharacterIndex = (n, max) => {
    let index = allChars.findIndex((c) => c.isSameNode(n));

    return Math.min(Math.max(index, 0), max);
  }

  let nodeToInsertBefore = allChars[newCursorPosition - 1];
  let cursor = select(`.${CURSOR_CLASS}`, element);

  element = nodeToInsertBefore?.parentNode || element;

  // Find the nearest word we're in, determined by the nearest spaces.
  let previousSpaceIndex = findCharacterIndex(
    findNearbySpace(cursor, "previous"), allChars.length
  );
  let nextSpaceIndex = findCharacterIndex(findNearbySpace(cursor, "next"), allChars.length);

  // slice() does not include the "end" item, so we need to increment it.
  let charactersToWrap = allChars.slice(nextSpaceIndex, previousSpaceIndex + 1);

  // let elValue = charactersToWrap.reduce((str, i) => {
  //   str = str + (i.nodeValue || "");

  //   return str;
  // }, "");

  // console.log(elValue);

  element.insertBefore(cursor as any, nodeToInsertBefore || null);

  if (charactersToWrap.length) {
    // Mount a placeholder node that will be replaced with the 
    // "wrapper" containing the word we're inside of. 
    let mountNode = createTextNode("X");
    charactersToWrap[0].parentElement.insertBefore(
      mountNode,
      charactersToWrap[0]
    );

    let charactersToWrapWithCursor = charactersToWrap.map((c) => {
      return c.nextSibling?.isSameNode(cursor)
        ? [c, c.nextSibling]
        : c;
    }).flat();

    // Take each character and throw it into the wrapper;
    let wrapperNode = createElement("span");
    wrapperNode.style.display = "inline-block";
    wrapperNode.classList.add("ti-wrapper");

    // IT APPEARS TO BE HERE!
    let wordWrap = charactersToWrapWithCursor.reduce((wrapper, character) => {

      // Is the space not getting copied?
      
      // if (character.nodeValue == " ") {
      //   character = "\u200b";
      // } 
      
      wrapper.prepend(character);

      return wrapper;
    }, wrapperNode);

    // Replace the word with the wrapped version, so that we can enforce
    // "inline-block" styling around just that word.
    mountNode.replaceWith(wordWrap);

  }
};
