import isInput from "./isInput";
import { Element } from "../types";
import toArray from "./toArray";
import getAllTypeableNodes from "./getAllTypeableNodes";
import select from "./select";
import { CURSOR_CLASS } from "../contants";

/**
 * Get a flattened array of text nodes that have been typed.
 * This excludes any cursor character that might exist.
 */
const getAllChars = (element: Element) => {
  return isInput(element)
    ? toArray(element.value)
    : getAllTypeableNodes(
        element,
        select(`.${CURSOR_CLASS}`, element) as any,
        true
      );
};

export default getAllChars;
