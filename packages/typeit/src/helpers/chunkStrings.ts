import toArray from "./toArray";
import getParsedBody from "./getParsedBody";
import getAllTypeableNodes from "./getAllTypeableNodes";

import { Character } from "../types";

/**
 * Given a node, generate an array of split text and nodes.
 */
export const constructQueueFromNodes = (el: Element): Character[] => {
  let nodeArray = getAllTypeableNodes(el);

  return nodeArray.flatMap((item) => {
    if (item.nodeValue) {
      return toArray(item.nodeValue).map((character) => {
        return createCharacterObject(character, item);
      });
    }

    return createCharacterObject(item);
  });
};

/**
 * Construct a character object to be placed in the queue.
 * When a `null` node is passed, it's being used as a quick
 * way to add a single text node to the element.
 */
export const createCharacterObject = (
  content: string | Node,
  node: null | Node = null
): Character => {
  return { node, content };
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
  return toArray(str).map((char) => createCharacterObject(char));
}
