import createElement from "./createElement";

export default fromElement => {
  let stylePrefixes = ["font", "lineHeight", "color"];
  let dummyElement = createElement("SPAN");
  let styles = window.getComputedStyle(fromElement, null);

  for (let key in styles) {
    if (stylePrefixes.indexOf(key) > -1 && styles[key]) {
      dummyElement.style[key] = styles[key];
    }
  }

  return dummyElement.style.cssText;
};
