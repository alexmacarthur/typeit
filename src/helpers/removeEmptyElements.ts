import { Element } from "../types";
import removeNode from "./removeNode";

/**
 * Given a DOM scope and selector, remove any HTML element remnants,
 * EXCEPT for <br> tags, which may be typed but do not have any text content.
 *
 * @param {object} scope
 * @param {string} selector
 * @return {void}
 */
export default (node: Element) => {
  node.querySelectorAll("*").forEach((i) => {
    if (!i.innerHTML && i.tagName !== "BR") {
      let nodeToRemove = i;

      // Traverse up the DOM. If the empty node is the only node in the parent,
      // move up and delete that one...
      while (
        nodeToRemove!.parentElement!.childNodes.length === 1 &&
        nodeToRemove!.parentElement!.childNodes[0].isEqualNode(nodeToRemove)
      ) {
        nodeToRemove = nodeToRemove.parentElement;
      }

      removeNode(nodeToRemove as Element);
    }
  });
};
