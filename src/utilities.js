import createElement from "./helpers/createElement";

export function randomInRange(value, range) {
  return Math.abs(
    Math.random() * (value + range - (value - range)) + (value - range)
  );
}

export function appendStyleBlock(styles, id = "") {
  let styleBlock = createElement("style");
  styleBlock.id = id;
  styleBlock.appendChild(document.createTextNode(styles));
  document.head.appendChild(styleBlock);
}

export function generateHash() {
  return Math.random()
    .toString(36)
    .substring(2, 15);
}

export function removeComments(arrayOfStrings) {
  return arrayOfStrings.map(string => {
    return string.replace(/<\!--.*?-->/g, "");
  });
}
