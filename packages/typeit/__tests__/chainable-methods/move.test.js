import TypeIt from "../../src";
import * as wait from "../../src/helpers/wait";
import * as repositionCursor from "../../src/helpers/repositionCursor";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("timeouts fire correctly", () => {
  let waitSpy;

  beforeEach(() => {
    setHTML`<div>
      <span id="element"></span>
    </div>`;

    waitSpy = jest.spyOn(wait, "default");
  });

  it("Waits correct number of times when it's not instant.", (done) => {
    new TypeIt("#element", {
      strings: "abc",
      speed: 0,
      afterComplete: () => {
        // 1 - initial pause
        // 4 - typing
        // 3 - moving
        expect(waitSpy).toHaveBeenCalledTimes(8);
        done();
      },
    })
      .move(-2)
      .go();
  });

  it("Combines moves in same function when instant.", (done) => {
    new TypeIt("#element", {
      strings: "abc",
      speed: 0,
      afterComplete: () => {
        // 1 - initial pause
        // 4 - typing
        // 1 - moving
        expect(waitSpy).toHaveBeenCalledTimes(6);
        done();
      },
    })
      .move(-3, { instant: true })
      .go();
  });

  it("Moves to element via selector.", (done) => {
    setHTML`<div>
      <span id="element"></span>
    </div>`;

    new TypeIt("#element", {
      strings: "A <strong>B</strong> C",
      speed: 0,
      afterComplete: () => {
        // 1 initial pause
        // 6 string typing
        // 4 each "move"
        expect(waitSpy).toHaveBeenCalledTimes(11);
        done();
      },
    })
      .move("strong")
      .go();
  });
});

describe("moves only within range", () => {
  let repositionCursorSpy;

  beforeEach(() => {
    setHTML`<div>
      <span id="element"></span>
    </div>`;

    repositionCursorSpy = jest.spyOn(repositionCursor, "default");
  });

  it("bottom end of range", (done) => {
    new TypeIt("#element", {
      speed: 0,
      afterComplete: () => {
        expect(repositionCursorSpy.mock.calls).toEqual([
          [expect.anything(), expect.anything(), expect.anything(), 0],
          [expect.anything(), expect.anything(), expect.anything(), 0],
        ]);
        done();
      },
    })
      .type("Hi!")
      .move(2) // Number of steps is out of range of printed characters.
      .go();
  });

  it("top end of range", (done) => {
    new TypeIt("#element", {
      speed: 0,
      afterComplete: () => {
        expect(repositionCursorSpy.mock.calls).toEqual([
          [expect.anything(), expect.anything(), expect.anything(), 1],
          [expect.anything(), expect.anything(), expect.anything(), 2],
          [expect.anything(), expect.anything(), expect.anything(), 3],
          [expect.anything(), expect.anything(), expect.anything(), 3],
        ]);
        done();
      },
    })
      .type("Hi!")
      .move(-4) // Number of steps is out of range of printed characters.
      .go();
  });
});
