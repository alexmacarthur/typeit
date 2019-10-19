import createElement from "./createElement";

/**
 * Construct a node w/ given attributes and content.
 *
 * @param {string} tag
 * @param {array} attributes
 * @param {content}
 */
export default function(tag, attributes = [], content = "") {
  let node = createElement(tag);

  attributes.forEach(att => {
    node.setAttribute(att.name, att.value);
  });

  node.innerHTML = content;

  return node;
}
