/**
 * Determine if a given node has any sibling.
 *
 * @param {object} node
 * @return {boolean}
 */
export const hasCharacterAsNextSibling = (node, nodeToIgnore) => {
  let sibling = node.nextSibling;

  return sibling ? !sibling.isEqualNode(nodeToIgnore) : false;
};

/**
 * Determine if this node is the last one at every level in what's been printed.
 *
 * @param {object} node
 * @param {object} node (the cursor node)
 * @return {boolean}
 */
export default (node, nodeToIgnore) => {
  if (!node) {
    return false;
  }

  let hasReachedTop = false;
  let hasSiblingAtPosition = [];
  let n = node;

  while (!hasReachedTop) {
    hasSiblingAtPosition.push(hasCharacterAsNextSibling(n, nodeToIgnore));
    n = n.parentNode;

    if (!n || n.hasAttribute("data-typeit-id")) {
      hasReachedTop = true;
    }
  }

  // If it's last, it will be `false` at every level, as in,
  // it never has a sibling!
  return !hasSiblingAtPosition.some(position => position);
};
