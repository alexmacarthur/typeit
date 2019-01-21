/**
 * Convert each HTML entity (if any exist) to its respective character
 * @param string string
 */
export default function convertHTMLEntities(string) {
  return string.replace(/&(.+);/, function(match) {
    let txt = document.createElement("textarea");
    txt.innerHTML = match;
    return txt.value;
  });
}
