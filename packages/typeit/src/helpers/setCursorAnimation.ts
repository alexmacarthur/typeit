import { El } from "../types";
import beforePaint from "./beforePaint";

/**
 * Create and return an animation for the cursor.
 */
let setCursorAnimation = ({
  cursor,
  frames,
  options,
}: {
  cursor: El;
  frames: AnimationKeyFrame[];
  options: Partial<AnimationEffectTiming>;
}): Animation => {
  let animation = cursor.animate(frames, options);

  animation.pause();

  animation.id = cursor.dataset.tiAnimationId;

  // Kicking back the animation until after the next repaint
  // prevents odd freezing issues when a new animation is
  // generated in place of an older one.
  beforePaint(() => {
    beforePaint(() => {
      animation.play();
    });
  });

  return animation;
};

export default setCursorAnimation;
