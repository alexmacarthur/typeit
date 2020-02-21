/**
 * @param {object} HTML node
 */
export default node => {
  return node && node.parentNode.removeChild(node);
};
