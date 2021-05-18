import { Element } from "../types";

export default function (thing: string | Element): Element {
  return typeof thing === "string" ? document.querySelector(thing) : thing;
}
