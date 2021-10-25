/**
 * Parse a string as HTML and return the body
 * of the parsed document.
 */
export default (content): HTMLElement => {
  let doc = document.implementation.createHTMLDocument();
  doc.body.innerHTML = content;

  return doc.body;
};
