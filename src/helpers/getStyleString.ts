import createElement from "./createElement";
import getComputedStyle from "./getComputedStyle";

export default (fromElement: HTMLElement): string => {
  let { font, lineHeight, color} = getComputedStyle(fromElement);
  let dummyElement = createElement("I");
  let stylesToApply = { color, font, lineHeight };

  Object.assign(dummyElement.style, stylesToApply);

  return dummyElement.style.cssText;
};
