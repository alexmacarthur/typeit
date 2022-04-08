/**
 * Literally just wraps toArray() to save a few bytes
 * when it's repeatedly used.
 *
 * @param {any}
 * @return {array}
 */
export default (val): any[] => Array.from(val);
