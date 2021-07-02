import { Element } from "../types";
import select from "./select";

export default function (thing: string | Element): Element {
  return typeof thing === "string"
    ? (select(thing as string) as Element)
    : thing;
}
