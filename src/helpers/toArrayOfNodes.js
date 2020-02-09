import toArray from "./toArray";

export default function(thing) {
  if (typeof thing === "string") {
    thing = document.querySelectorAll(thing);
  } else if (!thing.forEach) {
    thing = [thing];
  }

  return toArray(thing);
}
