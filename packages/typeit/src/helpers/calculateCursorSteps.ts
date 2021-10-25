import { Element } from "../types";
import isNumber from "./isNumber";
import calculateStepsToSelector from "./calculateStepsToSelector";

type calculateCursorStepsArgs = {
  el: Element;
  move: number | string;
  cursorPos: number;
  to: string;
};

export default ({
  el,
  move,
  cursorPos,
  to,
}: calculateCursorStepsArgs): number => {
  if (isNumber(move)) {
    return (move as number) * -1;
  }

  let childIndex = calculateStepsToSelector(move as string, el, to);

  /**
   * Based on the current cursor position, calculate the number
   * of steps that the cursor needs to move.
   */
  return childIndex - cursorPos;
};
