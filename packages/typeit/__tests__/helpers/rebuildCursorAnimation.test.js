import rebuildCursorAnimation from "../../src/helpers/rebuildCursorAnimation";
import * as setCursorAnimation from "../../src/helpers/setCursorAnimation";

let cursor;

beforeEach(() => {
  setHTML`<span class='ti-cursor'>|</span>`;

  cursor = document.querySelector(".ti-cursor");
});

describe("no animation already exists", () => {
  it("does nothing.", () => {
    const setCursorAnimationSpy = jest.spyOn(setCursorAnimation, "default");

    rebuildCursorAnimation(cursor);

    expect(setCursorAnimationSpy).not.toHaveBeenCalled();
  });
});

describe("animation already exists", () => {
  let setCursorAnimationSpy;
  let newAnimation;
  let cancelMock;
  let getComputedTimingMock;
  let getKeyframesMock;

  beforeEach(() => {
    newAnimation = {};
    setCursorAnimationSpy = jest
      .spyOn(setCursorAnimation, "default")
      .mockImplementation(() => newAnimation);
    cancelMock = jest.fn();
    getComputedTimingMock = jest.fn(() => {
      return {
        easing: "some easing",
      };
    });
    getKeyframesMock = jest.fn().mockImplementation(() => {
      return ["frame1", "frame2", "frame3"];
    });
  });

  it("generates new animation with correct parameters", () => {
    const mockAnimation = {
      startTime: 999,
      cancel: cancelMock,
      effect: {
        getKeyframes: getKeyframesMock,
        getComputedTiming: getComputedTimingMock,
      },
    };

    global.HTMLElement.prototype.getAnimations = () => [mockAnimation];

    rebuildCursorAnimation(cursor);

    expect(newAnimation.startTime).toEqual(999);
    expect(cancelMock).toHaveBeenCalledTimes(1);
    expect(getKeyframesMock).toHaveBeenCalledTimes(1);
    expect(getComputedTimingMock).toHaveBeenCalledTimes(1);
    expect(setCursorAnimationSpy).toHaveBeenCalledWith({
      cursor,
      frames: ["frame1", "frame2", "frame3"],
      timingOptions: {
        easing: "some easing",
      },
    });
  });

  it("does not set startTime when one doesn't exist", () => {
    const mockAnimation = {
      startTime: null,
      cancel: cancelMock,
      effect: {
        getKeyframes: getKeyframesMock,
        getComputedTiming: getComputedTimingMock,
      },
    };

    global.HTMLElement.prototype.getAnimations = () => [mockAnimation];

    rebuildCursorAnimation(cursor);

    expect(newAnimation.startTime).toBeFalsy();
  });
});
