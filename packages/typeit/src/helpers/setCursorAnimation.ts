import { El } from "../types";
import beforePaint from "./beforePaint";

const DEFAULT_TIMING_OPTIONS: Partial<AnimationEffectTiming> = {
  iterations: Infinity,
  easing: "steps(2, start)",
  fill: "forwards",
};

const DEFAULT_FRAMES: AnimationKeyFrame[] = [0, 0, 1].map((n) => {
  return { opacity: n };
});

/**
 * Create and return an animation for the cursor.
 */
let setCursorAnimation = ({
  cursor,
  frames = null,
  timingOptions = {},
}: {
  cursor: El;
  frames?: AnimationKeyFrame[] | null;
  timingOptions: Partial<AnimationEffectTiming>;
}): Animation | null => {
  let animation = cursor.animate(frames || DEFAULT_FRAMES, {
    ...DEFAULT_TIMING_OPTIONS,
    ...timingOptions,
  });

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
