import isInput from "./isInput";
import toArray from "./toArray";
import getAllTypeableNodes from "./getAllTypeableNodes";
import isBodyElement from "./isBodyElement";
import { Character, Element } from "../types";

/**
 * Given a node, find the corresponding PRINTED node already in an element.
 *
 * @param {node} element
 * @param {object} element
 * @return {undefined | object}
 */
export const findPrintedNode = (node: Element, element: Element) => {
  let printedNodes = element.querySelectorAll("*");

  return [element].concat(toArray(printedNodes).reverse()).find((i) => {
    return (i.cloneNode() as HTMLElement).outerHTML === node.outerHTML;
  });
};

/**
 * Determine if a given node is the _last_ child in the element.
 * This will allow us to know if we should continue typing into it,
 * or if we should create another node to append at the end.
 */
export const isLastElement = (
  node: Node,
  nodeToIgnore: Node | null
): boolean => {
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
export default (
  element: Element,
  contentArg: Character,
  cursorNode: HTMLElement | null = null,
  cursorPosition: number
) => {
  let contentIsElement = contentArg.isHTMLElement;
  let content = contentIsElement
    ? contentArg.content
    : document.createTextNode(contentArg.content as string);

  if (isInput(element)) {
    element.value = `${element.value}${contentArg.content}`;
    return;
  }

  // We're inserting a character within an element!
  if (!contentArg.isTopLevelText && !contentIsElement) {
    let parentNode = (contentArg.node as Node).parentNode as Element;
    let existingNode = findPrintedNode(
      parentNode.cloneNode() as Element,
      element
    ) as Element;

    // This node is already there, so keep typing into it.
    if (isLastElement(existingNode, cursorNode)) {
      element = existingNode;

      // Otherwise, we need to create an element!
    } else {
      // Overwrite the content with a newly created element and set the content to type.
      content = parentNode.cloneNode() as Element;
      content["innerText"] = contentArg.content;

      // This new element may be nested in ANOTHER element
      if (!isBodyElement(parentNode.parentNode)) {
        let parent: Element | null = parentNode.parentNode as Element;
        let parentClone = parent.cloneNode() as Element;
        let newElement = findPrintedNode(parentClone, element);

        while (!newElement && !isBodyElement(parent)) {
          // Wrap our element in the to-be-created parent node.
          // Then, we need to find the next candidate to print into.
          parentClone.innerHTML = content["outerHTML"];
          content = parentClone;
          parentClone = parent!.parentNode!.cloneNode() as Element;
          parent = parent!.parentNode as Element;

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
  elementToTypeInto!.insertBefore(
    content as Element,
    (elementToTypeInto as Element).contains(cursorNode) ? cursorNode : null
  );
};
