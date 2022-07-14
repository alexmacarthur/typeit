import setCursorAnimation from "../../src/helpers/setCursorAnimation";
import * as beforePaint from "../../src/helpers/beforePaint";

let cursor;
let mockAnimate;
let mockPause;
let mockPlay;
let beforePaintSpy;

beforeEach(() => {
  setHTML`<span class='ti-cursor' data-ti-animation-id="123abc">|</span>`;

  cursor = document.querySelector(".ti-cursor");

  beforePaintSpy = jest
    .spyOn(beforePaint, "default")
    .mockImplementation((cb) => {
      return cb();
    });
  mockPause = jest.fn();
  mockPlay = jest.fn();
  mockAnimate = jest.fn(() => {
    return {
      pause: mockPause,
      play: mockPlay,
    };
  });

  cursor.animate = mockAnimate;
});

describe("setting correct options", () => {
  it("sets correct defaults", () => {
    setCursorAnimation({
      cursor,
      frames: [{ opacity: 0 }, { opacity: 0 }, { opacity: 1 }],
      options: {
        easing: "steps(2, start)",
        fill: "forwards",
        iterations: 3,
      },
    });

    expect(mockAnimate).toBeCalledTimes(1);
    expect(mockAnimate).toBeCalledWith(
      [{ opacity: 0 }, { opacity: 0 }, { opacity: 1 }],
      {
        iterations: 3,
        easing: "steps(2, start)",
        fill: "forwards",
      }
    );
  });

  it("takes custom options", () => {
    setCursorAnimation({
      cursor,
      frames: [{ height: "10px" }, { height: "50px" }],
      options: {
        iterations: 3,
        easing: "linear",
        fill: "backwards",
      },
    });

    expect(mockAnimate).toBeCalledTimes(1);
    expect(mockAnimate).toBeCalledWith(
      [
        {
          height: "10px",
        },
        {
          height: "50px",
        },
      ],
      {
        iterations: 3,
        easing: "linear",
        fill: "backwards",
      }
    );
  });
});

describe("initial behavior", () => {
  it("pauses and then plays after repaint", () => {
    let animation = setCursorAnimation({ cursor });

    expect(mockPause).toHaveBeenCalledTimes(1);
    expect(mockPlay).toHaveBeenCalledTimes(1);
    expect(beforePaintSpy).toHaveBeenCalledTimes(2);
  });

  it("sets correct animation ID", () => {
    let animation = setCursorAnimation({ cursor });

    expect(animation.id).toEqual("123abc");
  });
});
