/**
 * Parse a string as HTML and return the body
 * of the parsed document.
 *
 * @param {string} content
 * @return {object}
 */
export default content => {
  let doc = document.implementation.createHTMLDocument("");
  doc.body.innerHTML = content;
  return doc.body;
};
