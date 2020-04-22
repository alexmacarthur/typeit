import isTypeableNode from "./isTypeableNode";
import toArray from "./toArray";
import flatten from "./flatten";

/**
 * Retrieve all text/BR nodes that exist inside an element.
 */
const getAllTypeableNodes = (element, parentToExclude, shouldReverse) => {
  parentToExclude = parentToExclude || null;
  shouldReverse = shouldReverse !== undefined ? shouldReverse : false;

  let nodes = toArray(element.childNodes).map(child => {
    return isTypeableNode(child) ? child : getAllTypeableNodes(child);
  });

  nodes = flatten(nodes);

  if (parentToExclude) {
    nodes = nodes.filter(n => !parentToExclude.contains(n));
  }

  return shouldReverse ? nodes.reverse() : nodes;
};

export default getAllTypeableNodes;
