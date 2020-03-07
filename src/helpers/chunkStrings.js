import toArray from "../helpers/toArray";
import flatten from "../helpers/flatten";
import getParsedBody from "./getParsedBody";
import getAllTypeableNodes from "./getAllTypeableNodes";
import isBodyElement from "./isBodyElement";

/**
 * Given a node, generate an array of split text and nodes.
 *
 * @param {object} el
 */
export const constructQueueFromNodes = el => {
  let nodeList = getAllTypeableNodes(el);

  let characterObjects = nodeList.map(item => {
    if (!item.nodeValue) {
      return createCharacterObject(item);
    }

    return toArray(item.nodeValue).map(character => {
      return createCharacterObject(character, item);
    });
  });

  return flatten(characterObjects);
};

/**
 * Construct a character object to be placed in the queue.
 * When a `null` node is passed, it's being used as a quick
 * to add a single text node to the element.
 *
 * @param {object|null} node The DOM node to which this specific character belongs.
 * @param {string} content
 * @return {object}
 */
export const createCharacterObject = (content, node) => {
  node = node || null;
  let contentIsAnElement = content instanceof HTMLElement;

  return {
    // This will ALWAYS be a text node, even though
    // it may be contained in an HTML element.

    // When a node is being passed as content, this should be null.
    node,
    isTopLevelText:
      (!node || isBodyElement(node.parentNode)) && !contentIsAnElement,
    isHTMLElement: contentIsAnElement,
    content
  };
};

/**
 * Convert string to array of chunks that will be later
 * used to construct a TypeIt queue.
 *
 * @param {string} string
 * @return {array}
 */
export function chunkStringAsHtml(string) {
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
export function maybeChunkStringAsHtml(str, asHtml) {
  asHtml = asHtml !== undefined ? asHtml : true;

  if (asHtml) {
    return chunkStringAsHtml(str);
  }

  // For plain strings, we still need to transform them into character objects.
  return toArray(str).map(char => {
    return createCharacterObject(char);
  });
}
