import { Character, Element } from "../types";
import isNumber from "./isNumber";
import getAllTypeableNodes from "./getAllTypeableNodes";

type calculateCursorStepsArgs = {
  el: Element,
  move: number | string,
  cursorPos: number,
  to: string
}

export default ({
  el,
  move,
  cursorPos,
  to
}: calculateCursorStepsArgs): number => {
  if (isNumber(move)) {
    return move as number * -1;
  }

  let movingToLast = to.match(/end/i);

  /**
   * A selector is passed. Find it in the DOM and calculate the
   * number of steps required to move the cursor to it.
   */
  let selectedElement = move ? el.querySelector(move as string) : el;
  let isMovingToEndOfRootElement = movingToLast && !move;

  /**
   * If we've fallen back to the root element, no index will be found, and `findIndex` will result to -1.
   * In order to prevent this weirdness from happening, force it to be 0.
   */
  let childIndex = isMovingToEndOfRootElement ? 0 : getAllTypeableNodes(el, null, true).findIndex((character: any) => {
    return character.isSameNode(selectedElement[`${movingToLast ? 'last' : 'first'}Child`]);
  });

  if (movingToLast) childIndex--;

  /**
   * Based on the current cursor position, calculate the number
   * of steps that the cursor needs to move.
   */
  return (childIndex + 1) - cursorPos;
};
