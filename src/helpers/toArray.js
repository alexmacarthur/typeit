/**
 * Splits a string into characters, or an array by break tags.
 *
 * @param {string} string
 * @return {array}
 */
export default string => {
  return Array.isArray(string) ? string : [string];
};
