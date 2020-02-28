export default function(thing) {
  return (typeof thing === "string")
    ? document.querySelector(thing)
    : thing;
}
