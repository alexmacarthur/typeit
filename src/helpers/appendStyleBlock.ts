import createElement from "./createElement";

export default (styles: string, id = ""): void => {
  let styleBlock: HTMLElement = createElement("style");
  styleBlock.id = id;
  styleBlock.appendChild(document.createTextNode(styles));
  document.head.appendChild(styleBlock);
};
