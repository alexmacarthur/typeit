import { CURSOR_CLASS, CURSOR_WRAPPER_CLASS, DATA_ATTRIBUTE } from "../constants";
import { El } from "../types";
import appendStyleBlock from "./appendStyleBlock";

export let cursorFontStyles = {
  "font-family": "",
  "font-weight": "",
  "font-size": "",
  "font-style": "",
  "line-height": "",
  color: "",
  transform: "translateX(-.125em)"
} as const;

export let setCursorStyles = (
  id: string,
  element: El
) => {
  let rootSelector = `[${DATA_ATTRIBUTE}='${id}']`;
  let cursorSelector = `${rootSelector} .${CURSOR_CLASS}`;
  let computedStyles = getComputedStyle(element);
  let customProperties: string = Object.entries(cursorFontStyles).reduce(
    (accumulator, [item, value]) => {
      return `${accumulator} ${item}: var(--ti-cursor-${item}, ${
        value || computedStyles[item]
      });`;
    },
    ""
  );

  // Set animation styles & custom properties.
  appendStyleBlock(
    `${cursorSelector} { display: inline-block; width: 0; ${customProperties} } ${cursorSelector}.with-delay { animation-delay: 500ms; } ${cursorSelector}.disabled { animation: none; } .${CURSOR_WRAPPER_CLASS} { display: inline-block; font: inherit; color: inherit; }`,
    id
  );
};
