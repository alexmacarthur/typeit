import { Element } from "../types";
import removeNode from "./removeNode";
import select from "./select";

/**
 * Given a DOM scope and selector, remove any HTML element remnants,
 * EXCEPT for <br> tags, which may be typed but do not have any text content.
 */
export default (node: Element, nodeToIgnore: Element) => {
  (select("*", node, true) as NodeList).forEach((i: any) => {
    if (!i.innerHTML && i.tagName !== "BR" && !i.isSameNode(nodeToIgnore)) {
      let nodeToRemove = i;

      // Traverse up the DOM. If the empty node is the only node
      // in the parent, move up and delete that one...
      while (
        nodeToRemove.parentElement.childNodes.length === 1 // There's only one item in there.
      ) {
        nodeToRemove = nodeToRemove.parentElement;
      }

      removeNode(nodeToRemove as Element);
    }
  });
};
