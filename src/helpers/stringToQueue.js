import flatten from "../helpers/flatten";
import getParsedBody from "../helpers/getParsedBody";
import nodeCollectionToArray from "./nodeCollectionToArray";

/**
 * Retrieve the attributes attached to a given node.
 *
 * @param {object} node
 * @return {array}
 */
export const getNodeAttributes = node => {
  return nodeCollectionToArray(node.attributes).map(att => {
    return {
      name: att.name,
      value: att.nodeValue
    };
  });
};

/**
 * Given a node, generate an array of split text and nodes.
 *
 * @param {object} el
 */
export const extractChildTextNodes = el => {
  return nodeCollectionToArray(el.childNodes).map(child => {
    // This is a text node, so just return the string value itself, but as an array with individual characters.
    if (child.nodeType === 3) {
      return child.nodeValue.split("");
    } else {
      return child;
    }
  });
};

/**
 * Transform each nested node into queue element objects,
 * as well as the passed node itself.
 *
 * @param {object} el
 * @return {array}
 */
export const transformNodeToQueue = (el, ancestorTree = []) => {
  // Needed so the queue has a dedicated item for
  // creating the initial shell of the element
  // when it comes time to type.
  let emptyElementObject = {
    ancestorTree,
    attributes: getNodeAttributes(el),
    content: ""
  };

  let result = extractChildTextNodes(el).map((item, index) => {
    // This is a node. Leave it be.
    if (!Array.isArray(item)) {
      return item;
    }

    // Convert string to an array so we can object-ify it.
    // We can confidently do this because we know it's inside an element.
    return item.map((character, index) => {
      return {
        ancestorTree,
        attributes: getNodeAttributes(el),
        content: character
      };
    });
  });

  // Add object for creating empty HTML element to front.
  result.unshift(emptyElementObject);

  return flatten(result);
};

/**
 * Given a raw 'queue' of text and nodes, expand each node into queue items.
 *
 * @param {array} queue
 */
export const convertNodesToItems = queue => {
  let processedQueue = queue.map(item => {
    if (item instanceof HTMLElement) {
      // We're only concerned if this node's parent is NOT the BODY or HTML tag.
      // This would mean it's a nested element.
      let node = item.parentNode;
      let ancestorTree = [item.tagName];

      while (["BODY", "HTML"].indexOf(node.tagName) < 0) {
        ancestorTree.push(node.tagName);
        node = node.parentNode;
      }

      return transformNodeToQueue(item, ancestorTree);
    }

    // It's just a text node; let it go.
    return item;
  });

  processedQueue = flatten(processedQueue);

  // We still have nodes in there! Keep going!
  if (processedQueue.some(item => item instanceof HTMLElement)) {
    return convertNodesToItems(processedQueue);
  }

  return processedQueue;
};

export default function HTMLStringToQueue(string) {
  let htmlBody = getParsedBody(string);
  let queue = extractChildTextNodes(htmlBody);

  // Turn each node into queue element objects.
  return convertNodesToItems(queue);
}
