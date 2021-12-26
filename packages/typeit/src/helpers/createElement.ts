import { Element } from "../types";

export default (el): Element => {
  return document.createElement(el);
};
