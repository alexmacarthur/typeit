import toArray from "./toArray";
import getParsedBody from "./getParsedBody";
import createTextNode from "./createTextNode";
import { CURSOR_CLASS } from "../constants";

import { Element } from "../types";

export function encodeSpaces (nodes) {
  return nodes.map((n) => {
    let value = n.nodeValue || "";

    if (/ /.test(value)) {
      n.nodeValue = "";
      
      value.split("").forEach((v) => {
        n.nodeValue += "\u00A0";
      });
    }

    return n;
  });
}

export function walkElementNodes(
  element: Element | Node, 
  shouldReverse: boolean = false, 
  shouldIncludeCursor: boolean = false
  ): Element[] {

  let cursor = document.querySelector(`.${CURSOR_CLASS}`);

  let walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_ALL,
    { 
      acceptNode: (node: Element) => {
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
    // Necessary for preserving reference to parent nodes as we empty elements during typing.
    nextNode.originalParent = nextNode.parentNode;
    nodes.push(nextNode);
  }

  let orderedNodes = shouldReverse ? nodes.reverse() : nodes;

  return encodeSpaces(orderedNodes);
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
