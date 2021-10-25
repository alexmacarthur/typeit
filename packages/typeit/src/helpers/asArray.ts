import isArray from "./isArray";

/**
 * Converts value as within array, unless the value itself already is one.
 */
export default <T>(value): T[] => {
  return isArray(value) ? value : [value];
};
