import { El, CursorOptions } from "../types";
import getAnimationFromElement from "./getAnimationFromElement";
import setCursorAnimation from "./setCursorAnimation";

interface rebuildCursorAnimationArgs {
  cursor: El | undefined;
  cursorOptions: CursorOptions;
  options: any;
}

let rebuildCursorAnimation = ({
  cursor,
  options,
  cursorOptions,
}: rebuildCursorAnimationArgs): Animation => {
  if (!cursor || !cursorOptions) return;

  let animation = getAnimationFromElement(cursor);
  let oldCurrentTime: CSSNumberish;

  // An existing animation is actively running...
  // so carry over the timing properties we care about.
  if (animation) {
    options.delay = animation.effect.getComputedTiming().delay;

    // This needs to be set later, since there's no way to pass
    // the current time into the constructor.
    oldCurrentTime = animation.currentTime;
    animation.cancel();
  }

  // Create a new animation using the same
  // configuration as the previous one.
  let newAnimation = setCursorAnimation({
    cursor,
    frames: cursorOptions.animation.frames,
    options,
  });

  // By setting the currentTime, the animation will
  // be in sync with the previous one.
  if (oldCurrentTime) {
    newAnimation.currentTime = oldCurrentTime;
  }

  return newAnimation;
};

export default rebuildCursorAnimation;
