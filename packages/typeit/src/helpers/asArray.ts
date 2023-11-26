import isArray from "./isArray";

/**
 * Converts value as within array, unless the value itself already is one.
 */
export default <T>(value): T[] => (isArray(value) ? value : [value]);
