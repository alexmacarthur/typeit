import { END } from "../constants";
import { QueueItem, Sides } from "../types";
import isNumber from "./isNumber";

interface countStepsToSelectorArgs {
  queueItems: QueueItem[];
  selector: string | number;
  cursorPosition: number;
  to: Sides;
}

const countStepsToSelector = ({
  queueItems,
  selector,
  cursorPosition,
  to,
}: countStepsToSelectorArgs): number => {
  if (isNumber(selector)) {
    return (selector as number) * -1;
  }

  let isMovingToEnd = new RegExp(END, "i").test(to);
  let selectorIndex = selector
    ? [...queueItems].reverse().findIndex(({ char }) => {
        let parentElement = char.parentElement;
        let parentMatches = parentElement.matches(selector);

        // We found the butt end of the selected element.
        if (isMovingToEnd && parentMatches) {
          return true;
        }

        // We found the very beginning of the selected element.
        return parentMatches && parentElement.firstChild.isSameNode(char);
      })
    : -1;

  // Couldn't find it the selector, so determine if we
  // need to move either to the beginning or the end.
  if (selectorIndex < 0) {
    selectorIndex = isMovingToEnd ? 0 : queueItems.length - 1;
  }

  let offset = isMovingToEnd ? 0 : 1;

  return selectorIndex - cursorPosition + offset;
};

export default countStepsToSelector;
