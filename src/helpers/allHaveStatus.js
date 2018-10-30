export default function(things, property, value) {
  if (!things.length) return false;

  let result = things.filter(thing => {
    return thing.status[property] === value;
  });

  return result.length === things.length;
}
