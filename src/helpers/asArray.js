import isArray from "./isArray";

/**
 * Converts value as within array, unless the value itself already is one.
 *
 * @param {string} string
 * @return {array}
 */
export default string => {
  return isArray(string) ? string : [string];
};
