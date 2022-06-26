import { CURSOR_CLASS } from "../constants";
import select from "./select";
import { El } from "../types";

export default (
  element: HTMLElement,
  allChars: any[],
  newCursorPosition: number
): void => {
  let nodeToInsertBefore = allChars[newCursorPosition - 1];
  let cursor = select(`.${CURSOR_CLASS}`, element) as El;
  element = nodeToInsertBefore?.parentNode || element;

  element.insertBefore(cursor as any, nodeToInsertBefore || null);
};
