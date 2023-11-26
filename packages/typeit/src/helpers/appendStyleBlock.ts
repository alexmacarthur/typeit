import createElement from "./createElement";
import createTextNode from "./createTextNode";

export default (styles: string, id: string = ""): void => {
  let styleBlock: HTMLElement = createElement("style");
  styleBlock.id = id;
  styleBlock.appendChild(createTextNode(styles));
  document.head.appendChild(styleBlock);
};
