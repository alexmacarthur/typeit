import { El } from "../types";
import setCursorAnimation from "./setCursorAnimation";

let rebuildCursorAnimation = (cursor: El) => {
  let animation = cursor.getAnimations()[0];

  if (!animation) {
    return;
  }

  let startTime = animation.startTime;

  animation.cancel();

  // Create a new animation using the same
  // configuration as the previous one.
  let newAnimation = setCursorAnimation({
    cursor,
    frames: (animation.effect as any).getKeyframes(),
    timingOptions:
      animation.effect.getComputedTiming() as AnimationEffectTiming,
  });

  if (startTime) {
    newAnimation.startTime = startTime;
  }
};

export default rebuildCursorAnimation;
