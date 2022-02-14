import isInput from "./isInput";
import select from "./select";
import { CURSOR_CLASS } from "../contants";
import { Element } from "../types";

let isBodyElement = (node): boolean => node?.tagName === "BODY";

/**
 * Inserts a set of content into the element. Intended for SINGLE characters.
 */
let insertIntoElement = (
  originalTarget: Element,
  character: Element
) => {
  if (isInput(originalTarget)) {
    originalTarget.value = `${originalTarget.value}${character.textContent}`;
    return;
  }

  character.innerHTML = "";

  let target = isBodyElement(character.originalParent) 
  ? originalTarget
  
  // If we add one-off fresh elements, there will be no 
  // "originalParent", so always fall back to the default target.
  : character.originalParent || originalTarget;

  target.insertBefore(
    character as Element,
    select("." + CURSOR_CLASS, target) as Node || null
  );
};

export default insertIntoElement;
