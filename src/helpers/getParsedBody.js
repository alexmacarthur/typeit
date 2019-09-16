/**
 * Parse a string as HTML and return the body
 * of the parsed document.
 *
 * @param {string} content
 * @return {object}
 */
export default content => {
  let parser = new DOMParser();
  let doc = parser.parseFromString(content, "text/html");
  return doc.body;
};
