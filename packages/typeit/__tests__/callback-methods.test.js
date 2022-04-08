import TypeIt from "../src";

beforeEach(() => {
  jest.clearAllMocks();

  setHTML`<div>
    <span id="el"></span>
  </div>`;
});

describe("beforeStep", () => {
  test("it should be called before each step", (done) => {
    const el = document.getElementById("el");
    const beforeStepMock = jest.fn();

    new TypeIt(el, {
      speed: 1,
      strings: "abc",
      beforeStep: beforeStepMock,
      afterComplete: () => {
        expect(beforeStepMock).toHaveBeenCalledTimes(4);
        done();
      },
    }).go();
  });
});

describe("afterStep", () => {
  test("it should be called after each step", (done) => {
    const el = document.getElementById("el");
    const afterStepMock = jest.fn();

    new TypeIt(el, {
      speed: 1,
      strings: "abcdef",
      afterStep: afterStepMock,
      afterComplete: () => {
        expect(afterStepMock).toHaveBeenCalledTimes(7);
        done();
      },
    }).go();
  });
});

describe("beforeString", () => {
  test("it should be called before each string via configuration object.", (done) => {
    const el = document.getElementById("el");
    const beforeStringMock = jest.fn();

    new TypeIt(el, {
      speed: 1,
      strings: ["string 1", "string 2"],
      beforeString: beforeStringMock,
      afterComplete: () => {
        expect(beforeStringMock).toHaveBeenCalledTimes(2);
        done();
      },
    }).go();
  });

  test("it should be called before each string via instance method.", (done) => {
    const el = document.getElementById("el");
    const beforeStringMock = jest.fn();

    new TypeIt(el, {
      speed: 1,
      beforeString: beforeStringMock,
      afterComplete: () => {
        expect(beforeStringMock).toHaveBeenCalledTimes(2);
        done();
      },
    })
      .type("1")
      .type("2")
      .go();
  });
});

describe("afterString", () => {
  test("it should be called after each string set via configuration object", (done) => {
    const el = document.getElementById("el");
    const afterStringMock = jest.fn();

    new TypeIt(el, {
      speed: 1,
      strings: ["string 1", "string 2", "string 3"],
      afterString: afterStringMock,
      afterComplete: () => {
        expect(afterStringMock).toHaveBeenCalledTimes(3);
        done();
      },
    }).go();
  });

  test("it should be called after each string set via instance method.", (done) => {
    const el = document.getElementById("el");
    const afterStringMock = jest.fn();

    new TypeIt(el, {
      speed: 1,
      afterString: afterStringMock,
      afterComplete: () => {
        expect(afterStringMock).toHaveBeenCalledTimes(4);
        done();
      },
    })
      .type("1")
      .type("2")
      .type("3")
      .type("4")
      .go();
  });
});

describe("afterComplete", () => {
  test("it should be called when everything's done.", (done) => {
    const el = document.getElementById("el");

    new TypeIt(el, {
      speed: 1,
      strings: "you did it. good job.",
      afterComplete: () => {
        done();
      },
    }).go();
  });
});
