import { El } from "../types";
import setCursorAnimation from "./setCursorAnimation";

declare global {
  interface AnimationEffect {
    getKeyframes: () => any
  }
}

let rebuildCursorAnimation = (cursor: El, delay: number): void => {
  let animation = cursor.getAnimations()[0];
  let oldCurrentTime: number;

  if (animation) {
    oldCurrentTime = animation.currentTime;
    animation.cancel();
  }

  let timingOptions = {
    ...animation.effect.getComputedTiming() as AnimationEffectTiming, 
    delay
  }

  // Create a new animation using the same
  // configuration as the previous one.
  let newAnimation = setCursorAnimation({
    cursor,
    frames: animation.effect.getKeyframes(),
    timingOptions
  });

  // By setting the currentTime, the animation will
  // be in sync with the previous one. But when we're 
  // totally pausing the animation (indicated by a `delay` 
  // value), there's no need to do this.
  if (oldCurrentTime) {
    // newAnimation.currentTime = oldCurrentTime;
  }
};

export default rebuildCursorAnimation;
