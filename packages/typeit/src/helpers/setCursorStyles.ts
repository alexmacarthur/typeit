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
  element: El, 
  includeCssAnimation: boolean,
  cursorSpeed: number, 
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

  if(includeCssAnimation) {
    appendStyleBlock(
      `@keyframes blink-${id} { 0% {opacity: 0} 49% {opacity: 0} 50% {opacity: 1} } ${cursorSelector} { animation: blink-${id} ${cursorSpeed / 1000}s infinite; }`,
      id
    );
  }

  // Set animation styles & custom properties.
  appendStyleBlock(
    `${cursorSelector} { display: inline-block; width: 0; ${customProperties} } ${cursorSelector}.with-delay { animation-delay: 500ms; } ${cursorSelector}.disabled { animation: none; } .${CURSOR_WRAPPER_CLASS} { display: inline-block; font: inherit; color: inherit; }`,
    id
  );
};
