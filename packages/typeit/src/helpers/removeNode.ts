import { Element } from "../types";

/**
 * @param {object} HTML node
 */
export default (node: Element | null) => {
  return node && node.remove();
};
