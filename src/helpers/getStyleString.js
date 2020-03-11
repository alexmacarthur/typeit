import createElement from "./createElement";
import getComputedStyle from "./getComputedStyle";

export default fromElement => {
  let stylePrefixes = ["font", "lineHeight", "color"];
  let dummyElement = createElement("SPAN");
  let styles = getComputedStyle(fromElement);

  for (let key in styles) {
    if (stylePrefixes.indexOf(key) > -1 && styles[key]) {
      dummyElement.style[key] = styles[key];
    }
  }

  return dummyElement.style.cssText;
};
