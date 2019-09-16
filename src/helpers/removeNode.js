/**
 * @param {object} HTML node
 */
export default node => {
  node.parentNode.removeChild(node);
};
