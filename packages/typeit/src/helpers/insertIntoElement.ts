import isInput from "./isInput";
import select from "./select";
import { CURSOR_CLASS } from "../constants";
import { El } from "../types";
import isBodyElement from "./isBodyElement";

/**
 * Inserts a set of content into the element. Intended for SINGLE characters.
 */
let insertIntoElement = (originalTarget: El, character: El) => {
  if (isInput(originalTarget)) {
    originalTarget.value = `${originalTarget.value}${character.textContent}`;
    return;
  }

  // Necessary for creating *empty* elements that will
  // later be filled with actual characters.
  character.innerHTML = "";

  let target = isBodyElement(character.originalParent as El)
    ? originalTarget
    : // If we add one-off fresh elements, there will be no
      // "originalParent", so always fall back to the default target.
      character.originalParent || originalTarget;

  target.insertBefore(
    character as El,
    (select("." + CURSOR_CLASS, target) as Node) || null
  );
};

export default insertIntoElement;
