import { CursorOptions, Options } from "./types";

export const DATA_ATTRIBUTE = "data-typeit-id";
export const CURSOR_CLASS = "ti-cursor";
export const START = "START";
export const END = "END";
export const DEFAULT_STATUSES = {
  started: false,
  completed: false,
  frozen: false,
  destroyed: false,
};

export const DEFAULT_OPTIONS: Options & {
  cursor: Required<CursorOptions>;
} = {
  breakLines: true,
  cursor: {
    autoPause: true,
    autoPauseDelay: 500,
    animation: {
      frames: [0, 0, 1].map((n) => {
        return { opacity: n };
      }),
      options: {
        iterations: Infinity,
        easing: "steps(2, start)",
        fill: "forwards",
      },
    },
  },
  cursorChar: "|",
  cursorSpeed: 1000,
  deleteSpeed: null,
  html: true,
  lifeLike: true,
  loop: false,
  loopDelay: 750,
  nextStringDelay: 750,
  speed: 100,
  startDelay: 250,
  startDelete: false,
  strings: [],
  waitUntilVisible: false,
  beforeString: () => {},
  afterString: () => {},
  beforeStep: () => {},
  afterStep: () => {},
  afterComplete: () => {},
};
export const PLACEHOLDER_CSS = `[${DATA_ATTRIBUTE}]:before {content: '.'; display: inline-block; width: 0; visibility: hidden;}`;
