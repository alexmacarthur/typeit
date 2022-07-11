import { El } from "../types";
import select from "./select";

export default function (thing: string | El): El {
  return typeof thing === "string" ? (select(thing as string) as El) : thing;
}
