import TypeIt from "../../src/TypeIt.ts";
import * as wait from "../../src/helpers/wait";

beforeEach(() => {
  vi.clearAllMocks();
});

describe(".exec()", () => {
  let waitSpy;
  let element;

  beforeEach(() => {
    setHTML`<div>
      <span id="element"></span>
    </div>`;

    waitSpy = vi.spyOn(wait, "default");
    element = document.getElementById("element");
  });

  it("Fires callback with instance as argument.", (done) => {
    const execFunc = vi.fn();

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
