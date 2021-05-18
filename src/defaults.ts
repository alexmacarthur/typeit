import { Options } from "./types";

const defaults: Options = {
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

export default defaults;
