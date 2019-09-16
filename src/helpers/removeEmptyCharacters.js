import removeNode from "./removeNode";
import nodeCollectionToArray from "./nodeCollectionToArray";

/**
 * Check if a given character node is empty, either containing nothing or an empty HTML element.
 *
 * @param {object} node
 * @return {boolean}
 */
export const characterIsEmpty = node => {
  let childrenNodes = nodeCollectionToArray(node.childNodes);

  // There's nothing in here at all. Empty!
  if (!childrenNodes.length) {
    return true;
  }

  let childrenNode = childrenNodes[0];

  // Special treatment for <br> tags. These do not count as "empty."
  if (childrenNode.tagName === "BR") {
    return false;
  }

  // This is a text node. It's technically not empty.
  if (childrenNode.nodeType === 3) {
    return false;
  }

  // This is an empty HTML element!
  return !nodeCollectionToArray(childrenNodes[0].childNodes).length;
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
 * Given a DOM scope and selector, remove the empty `.ti-chars` nodes.
 *
 * @param {object} scope
 * @param {string} selector
 * @return {void}
 */
export default (scope, selector) => {
  let allChars = nodeCollectionToArray(scope.querySelectorAll(selector));
  let hasEmptyNodes = containsEmptyCharacter(allChars);

  while (allChars.length && hasEmptyNodes) {
    allChars.forEach(char => {
      if (characterIsEmpty(char)) {
        removeNode(char);
      }
    });

    allChars = nodeCollectionToArray(scope.querySelectorAll(selector));

    // Removing nodes might have created new empty nodes,
    // so we need to re-query and check again.
    hasEmptyNodes = containsEmptyCharacter(allChars);
  }

  return allChars;
};
