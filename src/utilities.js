export function isVisible(element) {
  let coordinates = element.getBoundingClientRect();

  //-- Element extends past bottom or right.
  if (
    coordinates.right > window.innerWidth ||
    coordinates.bottom > window.innerHeight
  ) {
    return false;
  }

  //-- Element extends past top or left.
  if (coordinates.top < 0 || coordinates.left < 0) {
    return false;
  }

  return true;
}

export function randomInRange(value, range) {
  return Math.abs(
    Math.random() * (value + range - (value - range)) + (value - range)
  );
}

export function removeComments(arrayOfStrings) {
  return arrayOfStrings.map(string => {
    return string.replace(/<\!--.*?-->/g, "");
  });
}

export function startsWith(string, search) {
  return string.indexOf(search) === 0;
}

export function toArray(string) {
  return Array.isArray(string) ? string.slice(0) : string.split("<br>");
}
