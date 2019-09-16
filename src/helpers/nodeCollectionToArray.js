/**
 * Convert a NodeList to an array of nodes. I only need this because
 * some browsers do not yet support Array.from().
 *
 * @param {NodeList} nodeList
 * @return {array}
 */
export default nodeList => {
  return [].slice.call(nodeList);
};
