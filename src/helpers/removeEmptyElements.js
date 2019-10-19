import removeNode from "./removeNode";
import nodeCollectionToArray from "./nodeCollectionToArray";

/**
 * Check if a given character node is empty, either containing nothing or an empty HTML element.
 *
 * @param {object} node
 * @return {boolean}
 */
export const characterIsEmpty = node => {
  // It's a text node. Leave it be.
  // Or, break tags are an exception.
  if (node.nodeType === 3 || node.tagName === "BR") {
    return false;
  }

  // If there's no first child, this is empty!
  return !node.firstChild;
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
  let allHTMLNodes = nodeCollectionToArray(node.querySelectorAll("*"));
  let hasEmptyNodes = containsEmptyCharacter(allHTMLNodes);

  while (allHTMLNodes.length && hasEmptyNodes) {
    let shouldRequery = false;

    allHTMLNodes.forEach(char => {
      if (characterIsEmpty(char)) {
        removeNode(char);
        shouldRequery = true;
      }
    });

    // Re-query, since we just removed nodes.
    // Conditionally do this, to avoid unnecessary queries.
    if (shouldRequery) {
      allHTMLNodes = nodeCollectionToArray(node.querySelectorAll("*"));
    }

    // Removing nodes might have created new empty nodes,
    // so we need to re-query and check again.
    hasEmptyNodes = containsEmptyCharacter(allHTMLNodes);
  }

  return allHTMLNodes;
};
