/**
 * Determine if a given node has any sibling.
 *
 * @param {object} node
 * @return {boolean}
 */
export const hasCharacterAsNextSibling = node => {
  return !!node.nextSibling;
};

/**
 * Determine if this node is the last one at every level in what's been printed.
 *
 * @param {object} node
 * @return {boolean}
 */
export default node => {
  if (!node) {
    return false;
  }

  let hasReachedTop = false;
  let hasSiblingAtPosition = [];
  let n = node;

  while (!hasReachedTop) {
    hasSiblingAtPosition.push(hasCharacterAsNextSibling(n));
    n = n.parentNode;

    if (!n || n.classList.contains("ti-container")) {
      hasReachedTop = true;
    }
  }

  // If it's last, it will be `false` at every level, as in,
  // it never has a sibling!
  return !hasSiblingAtPosition.some(position => position);
};
