import * as beforePaint from "../../src/helpers/beforePaint";
import * as rebuildCursorAnimation from "../../src/helpers/rebuildCursorAnimation";
import * as createCursorWrapper from "../../src/helpers/createCursorWrapper";
import * as destroyCursorWrapper from "../../src/helpers/destroyCursorWrapper";
import fireItem from "../../src/helpers/fireItem";
let cursor;

const addMockAnimation = (element, animationProperties = {}) => {
  const mockAnimation = {
    cancel: jest.fn(),
    currentTime: 999, 
    playState: "running", 
    effect: {
      getComputedTiming: () => {}, 
      getKeyframes: () => ["frame1", "frame2"]
    },
    ...animationProperties
  };

  element.getAnimations = () => [mockAnimation];

  return mockAnimation;
};

let rebuildCursorAnimationSpy;
let beforePaintSpy;
let destroyCursorWrapperSpy;
let createCursorWrapperSpy;
let mockAnimation;

beforeEach(() => {
  setHTML`<span id="cursor">|</span>`;
  
  cursor = document.getElementById("cursor");

  rebuildCursorAnimationSpy = jest
    .spyOn(rebuildCursorAnimation, "default")
    .mockImplementation(() => {});
  beforePaintSpy = jest
    .spyOn(beforePaint, "default")
    .mockImplementation((cb) => cb());
  destroyCursorWrapperSpy = jest.spyOn(destroyCursorWrapper, "default");
  createCursorWrapperSpy = jest.spyOn(createCursorWrapper, "default");

  mockAnimation = addMockAnimation(cursor);
});

describe("cursor setup and teardown", () => {
  it("attempts to destroy and create cursor wrapper every go", async () => {
    const wait = jest.fn((cb) => cb());
    const queueItems = [
      [
        Symbol(),
        {
          shouldPauseCursor: () => false,
          func: () => {},
          delay: 1,
        },
      ]
    ];

    const index = 0;
    await fireItem({
      index,
      queueItems,
      wait,
      cursor,
    });

    expect(destroyCursorWrapperSpy).toHaveBeenCalledTimes(1);
    expect(createCursorWrapperSpy).toHaveBeenCalledTimes(1);
  });
});

describe("cursor should be paused", () => {
  it("animation is cancelled and delay is set on new animation", async () => {
    const wait = jest.fn((cb) => cb());
    const queueItems = [
      [
        Symbol(),
        {
          shouldPauseCursor: () => true,
          func: () => {},
          delay: 1,
        },
      ]
    ];

    const index = 0;
    await fireItem({
      index,
      queueItems,
      wait,
      cursor,
    });

    expect(rebuildCursorAnimationSpy).toHaveBeenCalledTimes(1);
    expect(rebuildCursorAnimationSpy).toHaveBeenCalledWith({
      cursor, 
      frames: ["frame1", "frame2"], 
      timingOptions: {
        delay: 750
      }
    });

    expect(mockAnimation.cancel).toHaveBeenCalledTimes(1);
  });
});

describe("cursor should NOT be paused", () => {
  it("animation is not cancelled and no delay is set on new animation", async () => {
    const wait = jest.fn((cb) => cb());
    const queueItems = [
      [
        Symbol(),
        {
          shouldPauseCursor: () => false,
          func: () => {},
          delay: 1,
        },
      ]
    ];

    const index = 0;
    await fireItem({
      index,
      queueItems,
      wait,
      cursor,
    });

    expect(rebuildCursorAnimationSpy).toHaveBeenCalledTimes(1);
    expect(rebuildCursorAnimationSpy).toHaveBeenCalledWith({
      cursor, 
      frames: ["frame1", "frame2"], 
      timingOptions: {
        delay: 0
      }
    });

    expect(mockAnimation.cancel).not.toHaveBeenCalledTimes(1);
  });
});


describe("all items have delays", () => {
  it("does not group any items for execution.", async () => {
    const wait = jest.fn((cb) => cb());
    const [mock1, mock2] = makeMocks();
    const queueItems = [
      [
        Symbol(),
        {
          shouldPauseCursor: () => false,
          func: mock1,
          delay: 1,
        },
      ],
      [
        Symbol(),
        {
          shouldPauseCursor: () => false,
          func: mock2,
          delay: 1,
        },
      ],
    ];

    const index = 0;
    const resultIndex = await fireItem({
      index,
      queueItems,
      wait,
      cursor,
    });

    expect(beforePaintSpy).toHaveBeenCalledTimes(1);
    expect(mock1).toHaveBeenCalledTimes(1);
    expect(mock2).not.toHaveBeenCalled();

    // Index was not modified.
    expect(resultIndex).toBe(index);
    expect(wait).toHaveBeenCalledTimes(1);
  });
});

describe("some items have no delay", () => {
  it("groups items for execution.", async () => {
    const [mock1, mock2, mock3, mock4] = makeMocks();
    const wait = jest.fn();
    const queueItems = [
      [
        Symbol(),
        {
          shouldPauseCursor: () => false,
          func: mock1,
          delay: 0,
        },
      ],
      [
        Symbol(),
        {
          shouldPauseCursor: () => false,
          func: mock2,
          delay: 0,
        },
      ],
      [
        Symbol(),
        {
          shouldPauseCursor: () => false,
          func: mock3,
          delay: 0,
        },
      ],
      [
        Symbol(),
        {
          shouldPauseCursor: () => false,
          func: mock4,
          delay: 1,
        },
      ],
    ];

    const index = 0;
    const resultIndex = await fireItem({
      index,
      queueItems,
      wait,
      cursor,
    });

    [mock1, mock2, mock3].forEach((m) => {
      expect(m).toHaveBeenCalledTimes(1);
    });

    expect(mock4).not.toHaveBeenCalled();

    // Index was advanced.
    expect(resultIndex).toBe(2);
    expect(wait).not.toHaveBeenCalled();
  });
});
