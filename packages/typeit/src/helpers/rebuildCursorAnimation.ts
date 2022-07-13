import { El } from "../types";
import beforePaint from "./beforePaint";
import getAnimationFromElement from "./getAnimationFromElement";
import setCursorAnimation from "./setCursorAnimation";

declare global {
  interface AnimationEffect {
    getKeyframes: () => any;
  }
}

interface rebuildCursorAnimationArgs {
  cursor: El | undefined;
  frames: AnimationKeyFrame[];
  timingOptions: any;
}

let rebuildCursorAnimation = ({
  cursor,
  frames,
  timingOptions,
}: rebuildCursorAnimationArgs): Animation => {
  if (!cursor) return;

  let animation = getAnimationFromElement(cursor);
  let oldCurrentTime: number;

  // An existing animation is actively running...
  // so carry over the timing properties we care about.
  if (animation) {
    timingOptions.delay = animation.effect.getComputedTiming().delay;

    // This needs to be set later, since there's no way to pass
    // the current time into the constructor.
    oldCurrentTime = animation.currentTime;
    animation.cancel();
  }

  // Create a new animation using the same
  // configuration as the previous one.
  let newAnimation = setCursorAnimation({
    cursor,
    frames,
    timingOptions,
  });

  // By setting the currentTime, the animation will
  // be in sync with the previous one. But when we're
  // totally pausing the animation (indicated by a `delay`
  // value), there's no need to do this.
  if (oldCurrentTime) {
    newAnimation.currentTime = oldCurrentTime;
  }

  return newAnimation;
};

export default rebuildCursorAnimation;
