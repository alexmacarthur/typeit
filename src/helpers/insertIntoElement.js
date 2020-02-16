import isInput from "./isInput";
import toArray from "./toArray";
import getAllTypeableNodes from "./getAllTypeableNodes";

/**
 * Given a node, find the corresponding PRINTED node already in an element.
 *
 * @param {node} element
 * @param {object} element
 * @return {undefined | object}
 */
export const findPrintedNode = (node, element) => {
  let printedNodes = element.querySelectorAll("*");
  return [element].concat(toArray(printedNodes).reverse()).find(i => {
    let iClone = i.cloneNode();
    return iClone.outerHTML === node.outerHTML;
  });
};

/**
 * Determine if a given node is the _last_ child in the element.
 * This will allow us to know if we should continue typing into it,
 * or if we should create another node to append at the end.
 *
 * @param {object} node The node to check.
 * @param {object} nodeToIgnore Node to ignore.
 */
export const isLastElement = (node, nodeToIgnore) => {
  if (!node) {
    return false;
  }

  let sibling = node.nextSibling;

  return !sibling || sibling.isEqualNode(nodeToIgnore);
};

/**
 * Inserts a set of content into the element. Intended for SINGLE characters.
 *
 * @param {object} element
 * @param {object} contentArg A character object.
 * @param {string | object} content
 */
export default (element, contentArg, cursorNode = null, cursorPosition) => {
  let contentIsElement = contentArg.isHTMLElement;
  let content = contentIsElement
    ? contentArg.content
    : document.createTextNode(contentArg.content);

  if (isInput(element)) {
    element.value = `${element.value}${contentArg.content}`;
    return;
  }

  // We're inserting a character within an element!
  if (!contentArg.isTopLevelText && !contentIsElement) {
    let parentNode = contentArg.node.parentNode;
    let existingNode = findPrintedNode(parentNode.cloneNode(), element);

    // Only type into an existing element if there is one. This should only
    // happen when we've already started typing in an element,
    // and so we want to leave off where we started.
    if (isLastElement(existingNode, cursorNode)) {
      element = existingNode;

      // Otherwise, we need to create an element!
    } else {
      // Overwrite the content with a newly created element and set the content to type.
      content = parentNode.cloneNode();
      content.innerText = contentArg.content;

      // The _parent_ of the parent node isn't the body, which means we're printing this
      // new element INSIDE a different element. Need to do a dance to either find
      // the beginnings of that element, or else create one.
      if (parentNode.parentNode.tagName !== "BODY") {
        let parent = parentNode.parentNode;
        let parentClone = parent.cloneNode();
        let newElement = findPrintedNode(parentClone, element);

        while (!newElement && parent.tagName !== "BODY") {
          // Wrap our element in the to-be-created parent node.
          // Then, we need to find the next candidate to print into.
          parentClone.innerHTML = content.outerHTML;
          content = parentClone;
          parentClone = parent.parentNode.cloneNode();
          parent = parent.parentNode;

          newElement = findPrintedNode(parentClone, element);
        }

        // We found an element before reaching the top. Assign it!
        if (newElement) {
          element = newElement;
        }
      }
    }
  }

  let refNode = getAllTypeableNodes(element, cursorNode, true);
  refNode = refNode[cursorPosition - 1];
  refNode = element.contains(cursorNode) ? cursorNode : refNode;

  // If a cursor node exists, make sure we print BEFORE that, but only if the target
  // element actually contains it. Otherwise, stick it to the end of the element.
  element.insertBefore(content, refNode ? refNode : null);
};
