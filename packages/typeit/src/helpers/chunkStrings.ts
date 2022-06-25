import { El } from "../types";
import toArray from "./toArray";
import getParsedBody from "./getParsedBody";
import createTextNode from "./createTextNode";
import { CURSOR_CLASS } from "../constants";

export function walkElementNodes(
  element: El | Node, 
  shouldReverse: boolean = false, 
  shouldIncludeCursor: boolean = false
  ): El[] {
  let cursor = document.querySelector(`.${CURSOR_CLASS}`);

  let walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_ALL,
    { 
      acceptNode: (node: El) => {
        // Include the cursor node, but none of it's children.

        if (shouldIncludeCursor) {
          if(node.classList?.contains(CURSOR_CLASS)) {
            return NodeFilter.FILTER_ACCEPT;
          }

          if(cursor.contains(node)) {
            return NodeFilter.FILTER_REJECT;
          }
        }

        // Maybe exclude the cursor and its children.
        return node.classList?.contains(CURSOR_CLASS)
          ? NodeFilter.FILTER_REJECT
          : NodeFilter.FILTER_ACCEPT;
      } 
    },
  );

  let nextNode;
  let nodes = [];
  
  while (nextNode = walker.nextNode()) {
    // Necessary for preserving reference to parent nodes
    // as we empty elements during typing.
    // If this has already been set, don't do it again.
    if (!nextNode.originalParent) {
      nextNode.originalParent = nextNode.parentNode;
    }

    nodes.push(nextNode);
  }

  return shouldReverse ? nodes.reverse() : nodes;
}

/**
 * Convert string to array of chunks that will be later
 * used to construct a TypeIt queue.
 */
export function chunkStringAsHtml(string: string): El[] {
  return walkElementNodes(getParsedBody(string));
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
): Partial<El>[] {
  return asHtml
    ? chunkStringAsHtml(str)
    : toArray(str).map(createTextNode);
}
