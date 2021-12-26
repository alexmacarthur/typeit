import { Element } from "../types";
import expandTextNodes from "./expandTextNodes";

/**
 * Parse a string as HTML and return the body
 * of the parsed document, with all text nodes expanded.
 */
export default (content): Element => {
  let doc = document.implementation.createHTMLDocument();
  doc.body.innerHTML = content;

  return expandTextNodes(doc.body as Element);
};
