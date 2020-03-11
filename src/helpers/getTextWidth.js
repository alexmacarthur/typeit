import getComputedStyle from "./getComputedStyle";
import createElement from "./createElement";

export default el => {
  let canvas = createElement("canvas");
  let context = canvas.getContext("2d");
  context.font = getComputedStyle(el).getPropertyValue("font-size");
  return context.measureText(el.innerText).width;
};
