import createTextNode from "./createTextNode";
import { Element } from "../types";

let expandTextNodes = (element: Element): Element => {
    [...element.childNodes].forEach((child) => {
      if (child.nodeValue) {
        [...child.nodeValue].forEach((c) => {
          child.parentNode.insertBefore(createTextNode(c), child);
        });
  
        child.remove();
        return;
      }
  
      expandTextNodes(child as Element);
    });

    return element;
  };
  
  export default expandTextNodes;
