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

export function appendStyleBlock(styles, id = "") {
  let styleBlock = document.createElement("style");
  styleBlock.id = id;
  styleBlock.appendChild(document.createTextNode(styles));
  document.head.appendChild(styleBlock);
}

export function generateHash() {
  return Math.random()
    .toString(36)
    .substring(2, 15);
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

export function groupHTMLTags(arr) {
  let tPosition = [];
  let tag;
  let isEntity = false;

  for (let j = 0; j < arr.length; j++) {
    if (arr[j] === "<" || arr[j] === "&") {
      tPosition[0] = j;
      isEntity = arr[j] === "&";
    }

    if (arr[j] === ">" || (arr[j] === ";" && isEntity)) {
      tPosition[1] = j;
      j = 0;
      tag = arr.slice(tPosition[0], tPosition[1] + 1).join("");
      arr.splice(tPosition[0], tPosition[1] - tPosition[0] + 1, tag);
      isEntity = false;
    }
  }

  return arr;
}
