import TypeIt from "../../src";
import * as wait from "../../src/helpers/wait";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("deleting fires correctly", () => {
  test("Deletes until beginning of selected element.", (done) => {
    setHTML`<span id="el"></span>`;
    const el = document.getElementById("el");

    new TypeIt(el, {
      speed: 0,
      strings: "abc<strong>def</strong>ghi",
      afterComplete: () => {
        expect(el.innerHTML).toEqual(
          'abc<span class="ti-cursor with-delay">|</span>'
        );
        done();
      },
    })
      .delete("strong")
      .go();
  });

  test("Deletes until beginning of end element.", (done) => {
    setHTML`<span id="el"></span>`;
    const el = document.getElementById("el");

    new TypeIt(el, {
      speed: 0,
      strings: "abc<strong>def</strong>ghi",
      afterComplete: () => {
        expect(el.innerHTML).toEqual(
          'abc<strong>def</strong><span class="ti-cursor with-delay">|</span>'
        );
        done();
      },
    })
      .delete("strong", { to: "end" })
      .go();
  });
});

describe("timeouts fire correctly", () => {
  let waitSpy;

  beforeEach(() => {
    setHTML`<div>
      <span id="element"></span>
    </div>`;

    waitSpy = jest.spyOn(wait, "default");
  });

  test("Executes correctly when deletion is not instant.", (done) => {
    new TypeIt("#element", {
      strings: "abc",
      speed: 0,
      afterComplete: () => {
        // 1 - initial pause
        // 4 - typing
        // 4 - deleting
        expect(waitSpy).toHaveBeenCalledTimes(9);
        done();
      },
    })
      .delete(null)
      .go();
  });

  test("Executes correctly when deletion is instant.", (done) => {
    new TypeIt("#element", {
      strings: "abc",
      speed: 0,
      afterComplete: () => {
        // Includes initial pause, typing, and one cursor movement.
        // 1 - initial pause
        // 4 - typing
        // 1 - deleting
        expect(waitSpy).toHaveBeenCalledTimes(6);
        done();
      },
    })
      .delete(null, { instant: true })
      .go();
  });

  test("Executes correctly when number of characters is passed.", (done) => {
    new TypeIt("#element", {
      strings: "abc",
      speed: 0,
      afterComplete: () => {
        // 1 - initial pause
        // 4 - _type action
        // 3 - _delete action
        expect(waitSpy).toHaveBeenCalledTimes(8);
        done();
      },
    })
      .delete(2)
      .go();
  });
});

describe("cursor has been moved", () => {
  beforeEach(() => {
    setHTML`<div>
      <span id="element"></span>
    </div>`;
  });

  test("Executes correctly when number of characters is passed", (done) => {
    new TypeIt("#element", {
      strings: "abc <strong>def</strong> ghi <em>jkl</em> mno",
      speed: 0,
      afterComplete: () => {
        expect(document.body.querySelector("#element").innerHTML).toEqual(
          'abc <strong>def</strong> g<em><span class="ti-cursor with-delay">|</span>jkl</em> mno'
        );
        done();
      },
    })
      .move("em")
      .delete(3)
      .go();
  });

  test("Executes correctly when selector is passed", (done) => {
    new TypeIt("#element", {
      strings: "abc <strong>def</strong> ghi <em>jkl</em> mno",
      speed: 0,
      afterComplete: () => {
        expect(document.body.querySelector("#element").innerHTML).toEqual(
          'abc <span class="ti-cursor with-delay">|</span> mno'
        );
        done();
      },
    })
      .move("em", { to: "end" })
      .delete("strong", { instant: true })
      .go();
  });
});
