import rebuildCursorAnimation from "../../src/helpers/rebuildCursorAnimation";
import * as setCursorAnimation from "../../src/helpers/setCursorAnimation";

let cursor;

const addMockAnimation = (element, animationProperties = {}) => {
  const mockAnimation = {
    cancel: jest.fn(),
    currentTime: 999,
    playState: "running",
    effect: {
      getComputedTiming: () => {
        return {
          delay: 500,
        };
      },
    },
    ...animationProperties,
  };

  element.getAnimations = () => [mockAnimation];

  return mockAnimation;
};

beforeEach(() => {
  setHTML`<span class='ti-cursor'>|</span>`;

  cursor = document.querySelector(".ti-cursor");
});

describe("animation already exists", () => {
  it("cancels it.", () => {
    let mockAnimation = addMockAnimation(cursor);
    const setCursorAnimationSpy = jest
      .spyOn(setCursorAnimation, "default")
      .mockImplementation(() => {
        return {};
      });

    let result = rebuildCursorAnimation({
      cursor,
      frames: [],
      timingOptions: {},
    });

    expect(setCursorAnimationSpy).toHaveBeenCalledTimes(1);
    expect(mockAnimation.cancel).toHaveBeenCalledTimes(1);
    expect(result.currentTime).toEqual(999);
  });
});

describe("animation has already been canceled", () => {
  it("does not cancel it or preserve current time.", () => {
    cursor.getAnimations = () => [];

    const setCursorAnimationSpy = jest
      .spyOn(setCursorAnimation, "default")
      .mockImplementation(() => {
        return {};
      });

    let result = rebuildCursorAnimation({
      cursor,
      frames: [],
      timingOptions: {},
    });

    expect(setCursorAnimationSpy).toHaveBeenCalledTimes(1);
    expect(result.currentTime).toEqual(undefined);
  });
});

describe("animation has been removed for some other reason", () => {
  it("does not attempt to cancel a nonexistent animation.", () => {
    cursor.getAnimations = () => [];

    const setCursorAnimationSpy = jest
      .spyOn(setCursorAnimation, "default")
      .mockImplementation(() => {
        return {};
      });

    let result = rebuildCursorAnimation({
      cursor,
      frames: [],
      timingOptions: {},
    });

    expect(setCursorAnimationSpy).toHaveBeenCalledTimes(1);
    expect(result.currentTime).toEqual(undefined);
  });
});
