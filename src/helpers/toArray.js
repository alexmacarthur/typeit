/**
 * Splits a string into characters, or an array by break tags.
 * @param {string} string
 */
export default string => {
  return Array.isArray(string) ? string.slice(0) : string.split("<br>");
};
