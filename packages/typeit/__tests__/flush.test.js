import TypeIt from "../src/TypeIt.ts";

beforeEach(() => {
  setHTML`<span id="el"></span>`;
  vi.clearAllMocks();
});

describe("deleting queue items", () => {
  test("Deletes queue items after execution.", () => {
    const el = document.getElementById("el");

    return new Promise((resolve) => {
      const instance = new TypeIt(el, { speed: 0 }).type("hello").flush(() => {
        expect(el.textContent).toEqual("hello|");
        expect(instance.getQueue().getItems(true)).toEqual([]);
        resolve();
      });
    });
  });

  test.only("Doesn't delete permanent queue items.", () => {
    const el = document.getElementById("el");

    return new Promise((resolve) => {
      const instance = new TypeIt(el, {
        speed: 0,
        afterComplete: () => {
          instance.type("goodbye").flush(() => {
            expect(el.textContent).toEqual("hellogoodbye|");
            expect(instance.getQueue().getItems(true).length).toBeGreaterThan(
              0,
            );
            resolve();
          });
        },
      })
        .type("hello")
        .go();
    });
  });

  test("fires last callback when flush called multiple times", () => {
    const el = document.getElementById("el");

    return new Promise((resolve) => {
      let iteration = 0;
      const instance = new TypeIt(el, { speed: 0 });

      instance.type("first").flush(() => (iteration = 1));
      instance.type("second").flush(() => (iteration = 2));
      instance.type("third").flush(() => {
        expect(el.textContent).toEqual("firstsecondthird|");
        expect(iteration).toEqual(0);
        resolve();
      });
    });
  });
});

describe("callbacks", () => {
  test("Does not call afterComplete() callback", () => {
    const el = document.getElementById("el");
    const afterCompleteCallback = vi.fn();

    return new Promise((resolve) => {
      new TypeIt(el, { speed: 0, afterComplete: afterCompleteCallback })
        .type("hello")
        .flush(() => {
          expect(afterCompleteCallback).not.toHaveBeenCalled();
          resolve();
        });
    });
  });
});
