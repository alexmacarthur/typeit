import "@testing-library/jest-dom/vitest";
import { beforeEach } from "vitest";
import "vitest-dom/extend-expect";

beforeEach(() => {
  let animation = {
    pause: () => {},
    play: () => {},
    effect: {
      getComputedTiming: () => {
        return {};
      },
      getKeyframes: () => [],
    },
    cancel: () => {},
    currentTime: 0,
  };

  // @ts-ignore
  globalThis.HTMLElement.prototype.animate = () => animation;
  // @ts-ignore
  globalThis.HTMLElement.prototype.getAnimations = () => [animation];
  // @ts-ignore
  globalThis.requestAnimationFrame = (cb) => {
    // @ts-ignore
    cb();
  };
});
