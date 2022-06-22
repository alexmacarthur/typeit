import { CURSOR_CLASS } from "../constants";
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

  // clean up!
  let existingWordWrapper = element.querySelector('.ti-wrapper');

  if(existingWordWrapper) {
    toArray(existingWordWrapper.childNodes).forEach(child => {
      element.insertBefore(child, existingWordWrapper);
    });

    removeNode(existingWordWrapper);
  }

  let findCharacterIndex = (n) => allChars.findIndex((c) => c.isSameNode(n));
  let nodeToInsertBefore = allChars[newCursorPosition - 1];
  let cursor = select(`.${CURSOR_CLASS}`, element);
  element = nodeToInsertBefore?.parentNode || element;

  // Find the nearest word we're in, determined by the nearest spaces.
  let previousSpaceIndex = findCharacterIndex(
    findNearbySpace(cursor, "previous")
  );
  let nextSpaceIndex = findCharacterIndex(findNearbySpace(cursor, "next"));
  let charactersToWrap = allChars.slice(nextSpaceIndex, previousSpaceIndex);

  element.insertBefore(cursor as any, nodeToInsertBefore || null);

  console.log("wrappering", charactersToWrap);

  if (charactersToWrap.length) {
    // Mount a placeholder node that will be replaced with the 
    // "wrapper" containing the word we're inside of. 
    let mountNode = createTextNode("");
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
    let wordWrap = charactersToWrapWithCursor.reduce((wrapper, character) => {
      wrapper.prepend(character);

      return wrapper;
    }, wrapperNode);

    // Replace the word with the wrapped version, so that we can enforce
    // "inline-block" styling around just that word.
    mountNode.replaceWith(wordWrap);
  }

};
