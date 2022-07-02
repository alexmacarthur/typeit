import { CURSOR_WRAPPER_CLASS } from "../constants";
import { El } from "../types";
import { walkElementNodes } from "./chunkStrings";
import removeNode from "./removeNode";

// Returns a boolean indicating if the cursor's animation 
// is due for a restart after DOM nodes have been moved.
let destroyCursorWrapper = (cursor: El) => {
  let wrapper = cursor.closest(`.${CURSOR_WRAPPER_CLASS}`);

  if (wrapper) {
    walkElementNodes(wrapper, false, true).forEach((n) => wrapper.before(n));

    removeNode(wrapper);
  }
};

export default destroyCursorWrapper;
