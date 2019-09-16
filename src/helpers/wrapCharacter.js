/**
 * Wrap character with `.ti-char` element. Intended for a single character.
 *
 * @param {string} character
 * @return {string}
 */
export default character => {
  return character === "" ? "" : `<i class="ti-char">${character}</i>`;
};
