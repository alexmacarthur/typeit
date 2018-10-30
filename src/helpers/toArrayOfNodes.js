export default function(thing) {
  if (typeof thing === "string") {
    thing = document.querySelectorAll(thing);
  } else if (!(thing instanceof NodeList)) {
    thing = [thing];
  }

  return [].slice.call(thing);
}
