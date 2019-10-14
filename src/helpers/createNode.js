/**
 * Construct a node w/ given attributes and content.
 * @todo: Rename!
 *
 * @param {string} tag
 * @param {array} attributes
 * @param {content}
 */
export default function({ tag, attributes = [], content = "" }) {
  let node = document.createElement(tag);

  if (attributes !== undefined) {
    attributes.forEach(att => {
      node.setAttribute(att.name, att.value);
    });
  }

  if (content) {
    node.innerHTML = content;
  }

  return node;
}
