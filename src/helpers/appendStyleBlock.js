import createElement from './createElement';

export default (styles, id) => {
  let styleBlock = createElement("style");
  styleBlock.id = id || "";
  styleBlock.appendChild(document.createTextNode(styles));
  document.head.appendChild(styleBlock);
}
