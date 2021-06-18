import calculateCursorSteps from "../../src/helpers/calculateCursorSteps";
import TypeIt from "../../src/TypeIt";

beforeEach(() => {
  setHTML`<span id="el"></span>`;
});

describe("arg is number", () => {
  it("returns inversed arg value", () => {
    const result = calculateCursorSteps({
      el: jest.fn(),
      move: 5,
      cursorPos: 0,
      to: {},
    });

    expect(result).toEqual(-5);
  });
});

describe("arg is null", () => {
  it("moves to START position of entire element", async () => {
    const el = document.querySelector("#el");

    await new Promise((resolve) => {
      new TypeIt(el, {
        strings: "Hello, <strong class='t'>Bob!</strong>",
        speed: 0,
        afterComplete: () => {
          return resolve();
        },
      }).go();
    });

    const result = calculateCursorSteps({
      el,
      move: null,
      cursorPos: 0,
      to: "START",
    });

    expect(result).toEqual(11);
  });

  it("moves to END position of element when specified", async () => {
    const el = document.querySelector("#el");

    await new Promise((resolve) => {
      new TypeIt(el, {
        strings: "Hello, <strong class='t'>Bob!</strong> Goodbye!",
        speed: 0,
        afterComplete: () => {
          return resolve();
        },
      }).go();
    });

    const result = calculateCursorSteps({
      el,
      move: null,
      cursorPos: 0,
      to: "end",
    });

    expect(result).toEqual(0);
  });
});

describe("arg is string", () => {
  it("should move to beginning of element that matches selector", async () => {
    const el = document.querySelector("#el");

    await new Promise((resolve) => {
      new TypeIt(el, {
        strings: "Hello, <strong class='t'>Bob!</strong>",
        speed: 0,
        afterComplete: () => {
          return resolve();
        },
      }).go();
    });

    const result = calculateCursorSteps({
      el,
      move: ".t",
      cursorPos: 0,
      to: "START",
    });

    expect(result).toEqual(4);
  });

  it("should move to end of element that matches selector when specified", async () => {
    const el = document.querySelector("#el");

    await new Promise((resolve) => {
      new TypeIt(el, {
        strings: "Hello, <strong class='t'>Bob!</strong> Bye.",
        speed: 0,
        afterComplete: () => {
          return resolve();
        },
      }).go();
    });

    const result = calculateCursorSteps({
      el,
      move: ".t",
      cursorPos: 0,
      to: "end",
    });

    expect(result).toEqual(6);
  });
});

describe("cursor is in the middle already", () => {
  it("calculates correctly when moving to the END", async () => {
    const el = document.querySelector("#el");

    await new Promise((resolve) => {
      new TypeIt(el, {
        strings: "Hello, <strong class='t'>Bob!</strong> Goodbye!",
        speed: 0,
        afterComplete: () => {
          return resolve();
        },
      }).go();
    });

    const result = calculateCursorSteps({
      el,
      move: null,
      cursorPos: 13,
      to: "end",
    });

    expect(result).toEqual(-13);
  });

  it("calculates correctly when moving to the START", async () => {
    const el = document.querySelector("#el");

    await new Promise((resolve) => {
      new TypeIt(el, {
        strings: "Hello, <strong class='t'>Bob!</strong> Goodbye!",
        speed: 0,
        afterComplete: () => {
          return resolve();
        },
      }).go();
    });

    const result = calculateCursorSteps({
      el,
      move: null,
      cursorPos: 13,
      to: "start",
    });

    expect(result).toEqual(7);
  });
});
