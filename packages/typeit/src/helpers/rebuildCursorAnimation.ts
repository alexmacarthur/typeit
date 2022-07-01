import { El } from "../types";
import setCursorAnimation from "./setCursorAnimation";

interface RebuildCursorAnimationArgs {
  cursor: El;
  startTime?: number;
  frames?: AnimationKeyFrame[];
  timingOptions: Partial<AnimationEffectTiming>
}

let rebuildCursorAnimation = ({
  cursor,
  startTime,
  frames,
  timingOptions,
}: RebuildCursorAnimationArgs): void => {
  let animation = cursor.getAnimations()[0];

  if (animation) animation.cancel();

  // Create a new animation using the same
  // configuration as the previous one.
  let newAnimation = setCursorAnimation({
    cursor,
    frames,
    timingOptions
  });

  console.log(newAnimation);

  if (startTime) {
    newAnimation.startTime = startTime;
  }
};

export default rebuildCursorAnimation;
