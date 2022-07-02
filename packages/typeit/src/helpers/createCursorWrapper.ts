import { CURSOR_WRAPPER_CLASS } from "../constants";
import { El } from "../types";
import createElement from "./createElement";
import createTextNode from "./createTextNode";

// Returns a boolean indicating if the cursor's animation 
// is due for a restart after DOM nodes have been moved.
let createCursorWrapper = (cursor: El) => {
  let wrapper = cursor.closest(`.${CURSOR_WRAPPER_CLASS}`);

  // Maybe wrap the cursor next to its previous sibling
  // to avoid line-break and cursor alignment issues.
  if (cursor.nextSibling && cursor.previousSibling && !wrapper) {
    let placeholder = createTextNode("");

    cursor.previousSibling.before(placeholder);

    let wrapper = createElement("span");
    wrapper.classList.add(CURSOR_WRAPPER_CLASS);
    wrapper.append(cursor.previousSibling, cursor);

    placeholder.replaceWith(wrapper);
  }
};

export default createCursorWrapper;
