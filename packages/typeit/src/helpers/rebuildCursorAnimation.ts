import { El } from "../types";
import setCursorAnimation from "./setCursorAnimation";

declare global {
  interface AnimationEffect {
    getKeyframes: () => any
  }
}

interface rebuildCursorAnimationArgs {
  cursor: El, 
  frames: AnimationKeyFrame[], 
  timingOptions: any
}

let rebuildCursorAnimation = ({
  cursor,
  frames, 
  timingOptions
}: rebuildCursorAnimationArgs): Animation => {
  let animation = cursor.getAnimations()[0];
  let oldCurrentTime: number;

  if (animation.playState !== "idle") {
    oldCurrentTime = animation.currentTime;
    animation.cancel();
  }

  // Create a new animation using the same
  // configuration as the previous one.
  let newAnimation = setCursorAnimation({
    cursor,
    frames,
    timingOptions
  });
  
  // By setting the currentTime, the animation will
  // be in sync with the previous one. But when we're 
  // totally pausing the animation (indicated by a `delay` 
  // value), there's no need to do this.
  if (!timingOptions.delay) {
    newAnimation.currentTime = oldCurrentTime;
  }

  return newAnimation;
};

export default rebuildCursorAnimation;
