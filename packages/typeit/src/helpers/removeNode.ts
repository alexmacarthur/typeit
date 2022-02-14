import { Element } from "../types";

/**
 * @param {object} HTML node
 */
export default (node: Element | null) => {
  if(!node) return;

  let nodeParent = node.parentNode as HTMLElement;
  let nodeToRemove = nodeParent.childNodes.length > 1
    // This parent still needs to exist.
    ? node

    // There's nothing else in there, so just delete the entire thing.
    // By doing this, we clean up markup as we go along.
    : nodeParent;

  nodeToRemove.remove();
};
