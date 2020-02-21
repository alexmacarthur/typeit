export default function(thing) {
  if (typeof thing === "string") {
    thing = document.querySelector(thing);
  }

  return thing;
}
