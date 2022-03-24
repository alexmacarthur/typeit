import TypeIt from "../../src";
import * as wait from "../../src/helpers/wait";

beforeEach(() => {
  jest.clearAllMocks();
});

describe(".exec()", () => {
  let waitSpy;
  let element;

  beforeEach(() => {
    setHTML`<div>
      <span id="element"></span>
    </div>`;

    waitSpy = jest.spyOn(wait, "default");
    element = document.getElementById("element");
  });

  it("Fires callback with instance as argument.", (done) => {
    const execFunc = jest.fn();

    const instance = new TypeIt("#element", {
      strings: "abc",
      speed: 0,
      afterComplete: () => {
        expect(execFunc).toHaveBeenCalledTimes(1);
        expect(execFunc).toHaveBeenCalledWith(instance);

        done();
      },
    })
      .exec(execFunc)
      .go();
  });
});
