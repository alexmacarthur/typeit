import isInput from "./isInput";
import { El } from "../types";
import toArray from "./toArray";
import { walkElementNodes } from "./chunkStrings";

/**
 * Get a flattened array of text nodes that have been typed.
 * This excludes any cursor character that might exist.
 */
let getAllChars = (element: El) => {
  if (isInput(element)) {
    return toArray(element.value);
  }

  return walkElementNodes(element, true).filter(
    (c) => !(c.childNodes.length > 0)
  );
};

export default getAllChars;
