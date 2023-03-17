import createTextNode from "./createTextNode";
import { El } from "../types";

const expandTextNodes = (
  element: El,
  stringSpliterator: (str: string) => string[]
): El => {
  [...element.childNodes].forEach((child) => {
    if (child.nodeValue) {
      stringSpliterator(child.nodeValue).forEach((c) => {
        child.parentNode.insertBefore(createTextNode(c), child);
      });

      child.remove();
      return;
    }

    expandTextNodes(child as El, stringSpliterator);
  });

  return element;
};

export default expandTextNodes;
