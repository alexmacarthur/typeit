/**
 * Parse a string as HTML and return the body
 * of the parsed document.
 */
export default (content): HTMLElement => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, "text/html");

  return doc.body;
};
