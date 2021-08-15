import createTextNode from "./createTextNode";
import getAllTypeableNodes from "./getAllTypeableNodes";
import isBodyElement from "./isBodyElement";
import isInput from "./isInput";
import toArray from "./toArray";
import { Character, Element } from "../types";
import select from "./select";

/**
 * Given a node, find the corresponding PRINTED node already in an element.
 */
export const findPrintedNode = (node: Element, elementToSearch: Element) => {
  let printedNodes: Element[] = toArray(select("*", elementToSearch, true));

  return [elementToSearch].concat(printedNodes.reverse()).find((i) => {
    return i.cloneNode().isEqualNode(node.cloneNode());
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
  let sibling = node.nextSibling;
  return !sibling || sibling.isEqualNode(nodeToIgnore);
};

/**
 * Inserts a set of content into the element. Intended for SINGLE characters.
 */
const insertIntoElement = (
  targetElement: Element, // Element we're typing into.
  character: Character, // Character/content we'll be typing.
  cursorNode: Element,
  cursorPosition: number
) => {
  let contentIsElement = character.content instanceof HTMLElement;
  let characterNode = character.node;
  let parentNode = characterNode?.parentNode;
  let content = contentIsElement
    ? character.content
    : createTextNode(character.content as string);

  if (isInput(targetElement)) {
    targetElement.value = `${targetElement.value}${character.content}`;
    return;
  }

  /**
   * This isn't top-level text here. We're inserting a character into an element!
   * We may to create one. Otherwise, we can continue to print into what's already there.
   */
  if (!contentIsElement && parentNode && !isBodyElement(parentNode)) {
    let existingNode = findPrintedNode(
      parentNode as Element,
      targetElement
    ) as Element;

    // The element is already there, so keep typing into it.
    if (existingNode && isLastElement(existingNode, cursorNode)) {
      targetElement = existingNode;
    } else {
      /**
       * We're creating a new element into which we'll insert our content.
       */
      content = parentNode.cloneNode() as Element;
      content.appendChild(createTextNode(character.content as string));

      // We're printing into ANOTHER element.
      let genericAncestor = parentNode.parentNode;
      let genericAncestorClone = genericAncestor.cloneNode();

      if (!isBodyElement(genericAncestor)) {
        let printedAncestor = findPrintedNode(
          genericAncestorClone as Element,
          targetElement
        );

        while (!printedAncestor && !isBodyElement(genericAncestor)) {
          /**
           * Important! Setting the new element's `innerText` to the `outerHTML` will mean
           * the previous content element will be set INSIDE of the element a level up.
           */
          let newContentNode = genericAncestorClone;
          newContentNode["innerHTML"] = content["outerHTML"];
          content = newContentNode;

          /**
           * Now, move up a level and check if the next ancestor has already been printed.
           * If so, we can escape out of here and use our new content element.
           */
          genericAncestor = genericAncestor.parentNode as Element;
          genericAncestorClone = genericAncestor.cloneNode();
          printedAncestor = findPrintedNode(
            genericAncestorClone as Element,
            targetElement
          );
        }

        targetElement = printedAncestor || targetElement;
      }
    }
  }

  let lastNode = getAllTypeableNodes(targetElement, cursorNode, true)[
    cursorPosition - 1
  ];
  let elementToTypeInto = lastNode ? lastNode.parentNode : targetElement;

  elementToTypeInto.insertBefore(
    content as Element,
    (elementToTypeInto as Element).contains(cursorNode) ? cursorNode : null
  );
};

export default insertIntoElement;
