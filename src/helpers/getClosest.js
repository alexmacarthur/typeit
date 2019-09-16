/**
 * Get the closest ancestor element to a provided element.
 *
 * @todo This is here for IE11, so when the time comes, remove it.
 *
 * @param {object} el
 * @param {string} match
 * @return {object|null}
 */
export default (el, match) => {
  do {
    if (el.matches(match)) return el;
    el = el.parentElement || el.parentNode;
  } while (el !== null && el.nodeType === 1);
  return null;
};
