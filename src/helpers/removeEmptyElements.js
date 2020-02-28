import removeNode from "./removeNode";
import toArray from "./toArray";
import isTypeableNode from "./isTypeableNode";

/**
 * Check if a given character node is empty, either containing nothing or an empty HTML element.
 *
 * @param {object} node
 * @return {boolean}
 */
export const characterIsEmpty = node => {
  return !node.firstChild && !isTypeableNode(node);
};

/**
 * Check if array of nodes contains any empty characters.
 *
 * @param {array} nodes
 * @return {boolean}
 */
export const containsEmptyCharacter = nodes => {
  return nodes.some(node => {
    return characterIsEmpty(node);
  });
};

/**
 * Given a DOM scope and selector, remove any HTML element remnants.
 *
 * @param {object} scope
 * @param {string} selector
 * @return {void}
 */
export default node => {
  let allHTMLNodes = toArray(node.querySelectorAll("*"));
  let hasEmptyNodes = containsEmptyCharacter(allHTMLNodes);

  while (allHTMLNodes.length && hasEmptyNodes) {
    let shouldReQuery = false;

    allHTMLNodes.forEach(char => {
      if (characterIsEmpty(char)) {
        removeNode(char);
        shouldReQuery = true;
      }
    });

    // Re-query, since we just removed nodes.
    // Conditionally do this, to avoid unnecessary queries.
    if (shouldReQuery) {
      allHTMLNodes = toArray(node.querySelectorAll("*"));
    }

    // Removing nodes might have created new empty nodes,
    // so we need to re-query and check again.
    hasEmptyNodes = containsEmptyCharacter(allHTMLNodes);
  }

  return allHTMLNodes;
};
