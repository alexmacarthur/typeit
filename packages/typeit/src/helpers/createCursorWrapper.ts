import { CURSOR_WRAPPER_CLASS } from "../constants";
import { El } from "../types";
import createElement from "./createElement";
import createTextNode from "./createTextNode";

let createCursorWrapper = (cursor: El) => {
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

export default createCursorWrapper;
