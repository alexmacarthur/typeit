import TypeIt from "../src";

beforeEach(() => {
  setHTML`<span id="el"></span>`;
  jest.clearAllMocks();
});

describe("deleting queue items", () => {
  test("Deletes queue items after execution.", (done) => {
    const el = document.getElementById("el");

    const instance = new TypeIt(el, { speed: 0 }).type("hello").flush(() => {
      expect(el.textContent).toEqual("hello|");
      expect(instance.getQueue().getItems(true)).toEqual([]);
      done();
    });
  });

  test("Doesn't delete permanent queue items.", (done) => {
    const el = document.getElementById("el");

    const instance = new TypeIt(el, {
      speed: 0,
      afterComplete: () => {
        instance.type("goodbye").flush(() => {
          expect(el.textContent).toEqual("hellogoodbye|");
          expect(instance.getQueue().getItems(true).length).toBeGreaterThan(0);
          done();
        });
      },
    })
      .type("hello")
      .go();
  });
});

describe("callbacks", () => {
  test("Does not call afterComplete() callback", (done) => {
    const el = document.getElementById("el");
    const afterCompleteCallback = jest.fn();

    new TypeIt(el, { speed: 0, afterComplete: afterCompleteCallback })
      .type("hello")
      .flush(() => {
        expect(afterCompleteCallback).not.toHaveBeenCalled();
        done();
      });
  });
});
