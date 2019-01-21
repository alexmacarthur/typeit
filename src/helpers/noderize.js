import convertHTMLEntities from "./convertHTMLEntities";

const PLACEHOLDER_PATTERN = "{%}";

/**
 * Replace nodes with string placeholders.
 *
 * @param string string
 */
export function placeholderize(string) {
  let parser = new DOMParser();
  let doc = parser.parseFromString(string, "text/html");
  let nodes = [].slice.call(doc.body.querySelectorAll("*"));

  //-- Remove empty tags.
  nodes = nodes.filter(item => {
    //-- This thing is empty.
    if (item.outerHTML.indexOf("></") > -1) {
      string = string.replace(item.outerHTML, "");
      return false;
    }

    return true;
  });

  //-- Replace node strings with placeholders. I'm not concerned with WHICH -- just want them all converted.
  nodes.forEach(item => {
    //-- Accounts for standard AND self closing tags (note the optional content & closing tag).
    string = string.replace(
      new RegExp(`<${item.tagName}(.*?)\/?>((.*?)<\/${item.tagName}>)?`, "i"),
      PLACEHOLDER_PATTERN
    );
  });

  return {
    string,
    nodes
  };
}

/**
 * Remove remants "%}" of placeholders that remain
 * after noderizing an array.
 *
 * @param array items
 */
export function removePlaceholderRemnants(items) {
  let isPruning = true;

  while (isPruning) {
    let hasLastCharacters = items.some((item, index) => {
      let isLastNodeObject =
        typeof item === "object" &&
        (item.isLastCharacter || item.content === null);

      if (
        isLastNodeObject &&
        items.slice(index + 1, index + 3).join("") === "%}"
      ) {
        items.splice(index + 1, 2);
        return true;
      }

      return false;
    });

    if (!hasLastCharacters) {
      isPruning = false;
    }
  }

  return items;
}

export default function(rawString) {
  let { string, nodes } = placeholderize(rawString);

  let stringArray = convertHTMLEntities(string).split("");
  let nodifiedArray = [];

  stringArray.forEach((item, index) => {
    //-- Just a regular character.
    if (stringArray.slice(index, index + 3).join("") !== PLACEHOLDER_PATTERN) {
      nodifiedArray.push(item);
      return;
    }

    //-- Replace placeholder w/ node objects.
    let firstCharacterIndex = index;
    let node = nodes.shift();
    let nodeContents = convertHTMLEntities(node.innerHTML).split("");
    let nodeAttributes = [].slice.call(node.attributes).map(att => {
      return {
        name: att.name,
        value: att.nodeValue
      };
    });

    if (nodeContents.length) {
      nodeContents.forEach((character, i) => {
        nodifiedArray.push({
          tag: node.tagName,
          attributes: nodeAttributes,
          content: character,
          isFirstCharacter: firstCharacterIndex === index,
          isLastCharacter: i + 1 === nodeContents.length
        });

        firstCharacterIndex++;
      });
    } else {
      nodifiedArray.push({
        tag: node.tagName,
        attributes: nodeAttributes,
        content: null
      });
    }
  });

  nodifiedArray = removePlaceholderRemnants(nodifiedArray);

  return nodifiedArray;
}
