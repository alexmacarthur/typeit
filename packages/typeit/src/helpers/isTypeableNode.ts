import { Element } from "../types";

/**
 * Returns `true` if node is of type `text` or is a <br> element.
 *
 * @param {object} node
 * @return {boolean}
 */
export default (node: Element): boolean => {
  return node.nodeType === 3 || node.tagName === "BR";
};
