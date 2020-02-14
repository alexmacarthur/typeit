/**
 * Retrieve all text nodes that exist inside an element.
 */
export default (element, parentToExclude = null) => {
  let treeWalker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
    function acceptNode(node) {
      if (!parentToExclude) {
        return NodeFilter.FILTER_ACCEPT;
      }

      return node.parentNode.isEqualNode(parentToExclude)
        ? NodeFilter.FILTER_REJECT
        : NodeFilter.FILTER_ACCEPT;
    },
    false
  );
  let nodeList = [];
  let currentNode = treeWalker.currentNode;

  while (currentNode) {
    nodeList.push(currentNode);
    currentNode = treeWalker.nextNode();
  }

  // The first item is the element itself, which we don't need.
  nodeList.shift();

  return nodeList;
};
