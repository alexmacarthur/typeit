import toArray from "./toArray";
import getParsedBody from "./getParsedBody";
import getAllTypeableNodes from "./getAllTypeableNodes";
import isBodyElement from "./isBodyElement";

import { Character } from "../types";

/**
 * Given a node, generate an array of split text and nodes.
 */
export const constructQueueFromNodes = (el): Character[] => {
  let nodeList = getAllTypeableNodes(el);

  let characterObjects = nodeList.map((item) => {
    if (!item.nodeValue) {
      return createCharacterObject(item);
    }

    return toArray(item.nodeValue).map((character) => {
      return createCharacterObject(character, item);
    });
  });

  return characterObjects.flat();
};

/**
 * Construct a character object to be placed in the queue.
 * When a `null` node is passed, it's being used as a quick
 * to add a single text node to the element.
 */
export const createCharacterObject = (
  content: string | Node,
  node: null | Node = null
): Character => {
  let contentIsAnElement: boolean = (content as any) instanceof HTMLElement;

  return {
    // This will ALWAYS be a text node, even though
    // it may be contained in an HTML element.

    // When a node is being passed as content, this should be null.
    node,
    isTopLevelText:
      (!node || isBodyElement(node.parentNode)) && !contentIsAnElement,
    isHTMLElement: contentIsAnElement,
    content,
  };
};

/**
 * Convert string to array of chunks that will be later
 * used to construct a TypeIt queue.
 */
export function chunkStringAsHtml(string: string): Character[] {
  let htmlBody = getParsedBody(string);

  return constructQueueFromNodes(htmlBody);
}

/**
 * Given a string, chunk it into array items to be later
 * converted to queue items for typing.
 *
 * @param {string} str
 * @param {boolean} asHtml
 * @return {array}
 */
export function maybeChunkStringAsHtml(
  str: string,
  asHtml = true
): Character[] {
  if (asHtml) {
    return chunkStringAsHtml(str);
  }

  // For plain strings, we still need to transform them into character objects.
  return toArray(str).map((char) => {
    return createCharacterObject(char);
  });
}
