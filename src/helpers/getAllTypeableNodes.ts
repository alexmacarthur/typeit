import isTypeableNode from "./isTypeableNode";
import toArray from "./toArray";

/**
 * Retrieve all text/BR nodes that exist inside an element.
 */
const getAllTypeableNodes = (
  element: HTMLElement,
  parentToExclude: HTMLElement | null = null,
  shouldReverse: boolean = false
): Node[] => {
  let nodes = toArray(element.childNodes)
    .map((child) => {
      return isTypeableNode(child) ? child : getAllTypeableNodes(child);
    })
    .flat();

  if (parentToExclude) {
    nodes = nodes.filter((n) => !parentToExclude.contains(n));
  }

  return shouldReverse ? nodes.reverse() : nodes;
};

export default getAllTypeableNodes;
