import { CURSOR_CLASS, CURSOR_WRAPPER_CLASS } from "../constants";
import { walkElementNodes } from "./chunkStrings";
import createElement from "./createElement";
import createTextNode from "./createTextNode";
import removeNode from "./removeNode";
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
