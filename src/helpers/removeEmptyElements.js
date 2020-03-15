import removeNode from "./removeNode";
import toArray from "./toArray";

/**
 * Given a DOM scope and selector, remove any HTML element remnants, including
 *
 * @param {object} scope
 * @param {string} selector
 * @return {void}
 */
export default node => {
  toArray(node.querySelectorAll("*")).forEach(i => {
    if (!i.innerHTML) {
      let nodeToRemove = i;

      while (
        nodeToRemove.parentNode.childNodes.length === 1 &&
        nodeToRemove.parentNode.childNodes[0].isEqualNode(nodeToRemove)
      ) {
        nodeToRemove = nodeToRemove.parentNode;
      }

      removeNode(nodeToRemove);
    }
  });
};
