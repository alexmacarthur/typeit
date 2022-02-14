import toArray from "./toArray";
import getParsedBody from "./getParsedBody";
import createTextNode from "./createTextNode";
import { CURSOR_CLASS } from "../contants";

import { Element } from "../types";

export function walkElementNodes(
  element: Element | Node, 
  shouldReverse: boolean = false
  ): Element[] {

  let walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_ALL,
    { 
      acceptNode: (node: Element) => { 
        // Always exclude the cursor + its children.
        return node?.classList?.contains(CURSOR_CLASS) 
          ? NodeFilter.FILTER_REJECT
          : NodeFilter.FILTER_ACCEPT;
      } 
    },
  );

  let nextNode;
  let nodes = [];
  
  while (nextNode = walker.nextNode()) {
    // Necessary for preserving reference to parent nodes as we empty elements during typing.
    nextNode.originalParent = nextNode.parentNode;
    nodes.push(nextNode);
  }

  return shouldReverse ? nodes.reverse() : nodes;
}

/**
 * Convert string to array of chunks that will be later
 * used to construct a TypeIt queue.
 */
export function chunkStringAsHtml(string: string): Element[] {
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
): Partial<Element>[] {
  return asHtml
    ? chunkStringAsHtml(str)
    : toArray(str).map(createTextNode);
}
