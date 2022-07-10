import createTextNode from "./createTextNode";
import { El } from "../types";

let expandTextNodes = (element: El): El => {
  [...element.childNodes].forEach((child) => {
    if (child.nodeValue) {
      [...child.nodeValue].forEach((c) => {
        child.parentNode.insertBefore(createTextNode(c), child);
      });

      child.remove();
      return;
    }

    expandTextNodes(child as El);
  });

  return element;
};

export default expandTextNodes;
