import { Options } from "./types";

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
export const DEFAULT_OPTIONS: Options = {
  breakLines: true,
  cursor: true,
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
