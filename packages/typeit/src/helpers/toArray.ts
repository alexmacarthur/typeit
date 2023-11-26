/**
 * Literally just wraps toArray() to save a few bytes
 * when it's repeatedly used.
 */
export default (val): any[] => Array.from(val);
