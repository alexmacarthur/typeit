import createNodeString from "./createNodeString";

/**
 * Group a collection of contents by HTML tags,
 * so that it can be correctly printed.
 *
 * If this were NOT to exist, each character supposed to be
 * inside an HTML tag would be individually wrapped by that tag.
 *
 * @param array contents
 */
export default function(contents) {
  contents = contents.map((character, index) => {
    if (
      typeof character === "object" &&
      (character.isFirstCharacter || character.content === null)
    ) {
      let pointer = index;
      let tagContent = [character.content];
      let hasLastCharacter = false;

      while (!hasLastCharacter) {
        pointer++;

        let nextItem = contents[pointer];

        if (nextItem !== undefined) {
          tagContent.push(nextItem.content);
        }

        if (nextItem === undefined || nextItem.isLastCharacter) {
          hasLastCharacter = true;
        }
      }

      return createNodeString({
        tag: character.tag,
        attributes: character.attributes,
        content: tagContent.join("")
      });
    }

    return character;
  });

  return contents.filter(item => typeof item !== "object");
}
