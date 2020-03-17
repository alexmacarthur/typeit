/**
 * @param {object} HTML node
 */
export default node => {
  return node?.parentNode?.removeChild(node);
};
