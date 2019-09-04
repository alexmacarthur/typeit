export default function(things, property, value) {
  if (!things.length) return false;

  // If any items lack the property, return `false.`
  return !things.some(function(thing) {
    return thing.status[property] !== value;
  });
}
