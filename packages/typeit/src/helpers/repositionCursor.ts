import { CURSOR_CLASS, CURSOR_WRAPPER_CLASS } from "../constants";
import { walkElementNodes } from "./chunkStrings";
import createElement from "./createElement";
import createTextNode from "./createTextNode";
import removeNode from "./removeNode";
import select from "./select";

export default (
  element: HTMLElement,
  allChars: any[],
  newCursorPosition: number
): void => {
  let wrapper = element.querySelector(`.${CURSOR_WRAPPER_CLASS}`);;

  // Clean-up!
  if(wrapper) {
    walkElementNodes(wrapper, true, true).forEach(n => {
      wrapper.before(n);
    });

    removeNode(wrapper);
  }

  let nodeToInsertBefore = allChars[newCursorPosition - 1];
  let cursor = select(`.${CURSOR_CLASS}`, element);
  element = nodeToInsertBefore?.parentNode || element;

  element.insertBefore(cursor as any, nodeToInsertBefore || null);

  // Maybe wrap the cursor next to its previous sibling
  // to avoid line-break and cursor alignment issues.
  if (cursor.nextSibling && cursor.previousSibling) {
    let placeholder = createTextNode("");

    cursor.previousSibling.before(placeholder);

    let wrapper = createElement("span");
    wrapper.classList.add(CURSOR_WRAPPER_CLASS);
    wrapper.append(cursor.previousSibling, cursor);

    placeholder.replaceWith(wrapper);
  }
};
