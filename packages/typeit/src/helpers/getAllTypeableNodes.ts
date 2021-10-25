import isTypeableNode from "./isTypeableNode";
import toArray from "./toArray";

/**
 * Retrieve all text/BR nodes that exist inside within an element. These
 * will be the nodes we're capable of typing onto the screen.
 */
const getAllTypeableNodes = (
  element: Element,
  parentToExclude: HTMLElement | null = null,
  shouldReverse: boolean = false
): Node[] => {
  let nodes = toArray(element.childNodes).flatMap((child) => {
    return isTypeableNode(child) ? child : getAllTypeableNodes(child);
  });

  if (parentToExclude) {
    nodes = nodes.filter((n) => !parentToExclude.contains(n));
  }

  return shouldReverse ? nodes.reverse() : nodes;
};

export default getAllTypeableNodes;
