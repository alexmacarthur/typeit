import { DEFAULT_OPTIONS } from "../constants";
import { CursorOptions } from "../types";
import merge from "./merge";

let processCursorOptions = (
  cursorOptions: boolean | CursorOptions
): boolean | CursorOptions => {
  if (typeof cursorOptions === "object") {
    let newOptions: CursorOptions = {};
    let { frames: defaultFrames, options: defaultOptions } =
      DEFAULT_OPTIONS.cursor.animation;

    newOptions.animation = cursorOptions.animation || {};
    newOptions.animation.frames =
      cursorOptions.animation?.frames || defaultFrames;
    newOptions.animation.options = merge(
      defaultOptions,
      cursorOptions.animation?.options || {}
    );
    newOptions.autoPause =
      cursorOptions.autoPause ?? DEFAULT_OPTIONS.cursor.autoPause;
    newOptions.autoPauseDelay =
      cursorOptions.autoPauseDelay || DEFAULT_OPTIONS.cursor.autoPauseDelay;

    return newOptions;
  }

  if (cursorOptions === true) {
    return DEFAULT_OPTIONS.cursor;
  }

  return cursorOptions;
};

export default processCursorOptions;
