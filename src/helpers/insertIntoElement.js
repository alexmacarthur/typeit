import isInput from "./isInput";
import toArray from "./toArray";
import getAllTypeableNodes from "./getAllTypeableNodes";
import isBodyElement from "./isBodyElement";

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
    return i.cloneNode().outerHTML === node.outerHTML;
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
export default (element, contentArg, cursorNode, cursorPosition) => {
  cursorNode = cursorNode || null;
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

    // This node is already there, so keep typing into it.
    if (isLastElement(existingNode, cursorNode)) {
      element = existingNode;

      // Otherwise, we need to create an element!
    } else {
      // Overwrite the content with a newly created element and set the content to type.
      content = parentNode.cloneNode();
      content.innerText = contentArg.content;

      // This new element may be nested in ANOTHER element
      if (!isBodyElement(parentNode.parentNode)) {
        let parent = parentNode.parentNode;
        let parentClone = parent.cloneNode();
        let newElement = findPrintedNode(parentClone, element);

        while (!newElement && !isBodyElement(parent)) {
          // Wrap our element in the to-be-created parent node.
          // Then, we need to find the next candidate to print into.
          parentClone.innerHTML = content.outerHTML;
          content = parentClone;
          parentClone = parent.parentNode.cloneNode();
          parent = parent.parentNode;

          newElement = findPrintedNode(parentClone, element);
        }

        // We found an element before reaching the top. Assign it!
        element = newElement || element;
      }
    }
  }

  let lastNode = getAllTypeableNodes(element, cursorNode, true)[
    cursorPosition - 1
  ];
  let elementToTypeInto = lastNode ? lastNode.parentNode : element;

  // If a cursor node exists, make sure we print BEFORE that, but only if the target
  // element actually contains it. Otherwise, stick it to the end of the element.
  elementToTypeInto.insertBefore(
    content,
    elementToTypeInto.contains(cursorNode) ? cursorNode : null
  );
};
