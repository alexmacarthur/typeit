import rebuildCursorAnimation from "../../src/helpers/rebuildCursorAnimation";
import * as setCursorAnimation from "../../src/helpers/setCursorAnimation";

let cursor;
let cursorOptions = {
  animation: {
    frames: [{ opacity: 1 }, { opacity: 0 }],
  },
};

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
      options: {},
      cursorOptions,
    });

    expect(setCursorAnimationSpy).toHaveBeenCalledTimes(1);
    expect(mockAnimation.cancel).toHaveBeenCalledTimes(1);
    expect(result.currentTime).toEqual(999);
  });
});

describe("animation has already been cancelled", () => {
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
      options: {},
      cursorOptions,
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
      options: {},
      cursorOptions,
    });

    expect(setCursorAnimationSpy).toHaveBeenCalledTimes(1);
    expect(result.currentTime).toEqual(undefined);
  });
});

describe("cursor options are not passed", () => {
  it("returns early.", () => {
    let mockAnimation = addMockAnimation(cursor);

    const setCursorAnimationSpy = jest.spyOn(setCursorAnimation, "default");

    rebuildCursorAnimation({
      cursor,
      frames: [],
      options: {},
      cursorOptions: false,
    });

    expect(mockAnimation.cancel).not.toHaveBeenCalled();
    expect(setCursorAnimationSpy).not.toHaveBeenCalled();
  });
});

describe("uses provided cursor options", () => {
  it("uses frames", () => {
    const setCursorAnimationSpy = jest.spyOn(setCursorAnimation, "default");

    rebuildCursorAnimation({
      cursor,
      frames: [],
      options: {},
      cursorOptions: {
        animation: {
          frames: [
            { transform: "rotate(0deg)" },
            { transform: "rotate(360deg)" },
          ],
        },
      },
    });

    expect(setCursorAnimationSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        cursor: cursor,
        frames: [
          { transform: "rotate(0deg)" },
          { transform: "rotate(360deg)" },
        ],
        options: expect.anything(),
      })
    );
  });
});
