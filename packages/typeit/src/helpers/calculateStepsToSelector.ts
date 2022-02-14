import select from "./select";
import { END, START } from "../contants";
import { walkElementNodes } from "./chunkStrings";
import { Element } from "../types";
import getAllChars from "./getAllChars";

/**
 * Calculates the number of steps between the END of an element and a selector.
 */
let calculateStepsToSelector = (
  selector: string,
  element: Element,
  to: string = START
): number => {
  let isMovingToLast = new RegExp(END, "i").test(to);

  /**
   * A selector is passed. Find it in the DOM and calculate the
   * number of steps required to move the cursor to it.
   */
  let selectedElement = selector
    ? (select(selector as string, element) as Element)
    : element;
  let selectedElementNodes = walkElementNodes(selectedElement, true);
  let selectedElementFirstChild = selectedElementNodes[0];
  let selectedElementLastChild =
    selectedElementNodes[selectedElementNodes.length - 1];
  let isMovingToEndOfRootElement = isMovingToLast && !selector;

  /**
   * If we've fallen back to the root element, no index will be found, and `findIndex` will result to -1.
   * In order to prevent this weirdness from happening, force it to be 0.
   */
  let childIndex = isMovingToEndOfRootElement
    ? 0
    : getAllChars(element).findIndex((character: any) => {
        return character.isSameNode(
          isMovingToLast ? selectedElementFirstChild : selectedElementLastChild
        );
      });

  if (isMovingToLast) childIndex--;

  return childIndex + 1;
};

export default calculateStepsToSelector;
