/**
 * Flatten a simple, not-deep array. Ideally, we'd be using .flat(),
 * but its browser support is not great.
 *
 * @param {array} arr
 * @return {array}
 */
export default arr => [].concat(...arr);
