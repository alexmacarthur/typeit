import TypeIt from "../src/TypeIt.ts";

let instance;
let args;
let element;

const getLast = (arr) => {
  return arr[arr.length - 1];
};

beforeEach(() => {
  setHTML`
    <div>
      <span id="element"></span>
    </div>
  `;

  args = [
    "#element",
    {
      speed: 0,
      strings: ["ABC", "EFG"],
    },
  ];

  instance = new TypeIt(...args);
  element = document.querySelector("#element");
});

describe("setting cursor options", () => {
  test("can set cursor to true", () => {
    return new Promise((resolve) => {
      args[1].cursor = true;
      args[1].afterComplete = resolve;

      new TypeIt(...args).go();
    });
  });

  test("can set cursor to false", () => {
    return new Promise((resolve) => {
      args[1].cursor = false;
      args[1].afterComplete = resolve;

      new TypeIt(...args).go();
    });
  });

  test("can set cursor to object", () => {
    return new Promise((resolve) => {
      args[1].cursor = {
        animation: {
          frames: [],
          options: {
            iterations: Infinity,
            easing: "linear",
            fill: "forwards",
          },
        },
      };

      args[1].afterComplete = resolve;

      new TypeIt(...args).go();
    });
  });
});

test("Initial queue only contains startDelay pause.", () => {
  args[1].strings = [];
  instance = new TypeIt(...args);
  expect(instance.getQueue().getItems()).toMatchSnapshot();
});

describe("hard-coded strings", () => {
  test("prepends hard-coded strings.", () => {
    setHTML`
    <div>
      <span id="element">Hard-coded string.</span>
    </div>
  `;

    let instance = new TypeIt("#element", {
      strings: ["My string."],
    });

    expect(instance.getOptions().strings).toEqual([
      "Hard-coded string.",
      "My string.",
    ]);
  });

  test("prepends hard-coded strings.", () => {
    setHTML`
    <div>
      <span id="element">ABC<br>DEF<br />GHI</span>
    </div>
  `;

    let instance = new TypeIt("#element");

    expect(instance.getOptions().strings).toEqual(["ABC", "DEF", "GHI"]);
  });

  test("removes HTML comments", () => {
    setHTML`
    <div>
      <span id="element">
        <!-- a comment! -->other stuff<!-- another one -->
      </span>
    </div>
  `;

    let instance = new TypeIt("#element");

    expect(instance.getOptions().strings).toEqual(["other stuff"]);
  });
});

test("Will not begin until explicitly called.", () => {
  setHTML`<div>
      <span id="element"></span>
    </div>`;

  return new Promise((resolve) => {
    const instance = new TypeIt("#element", {
      strings: "hello!",
      afterComplete: () => {
        expect(instance.is("started")).toBe(true);
        resolve();
      },
    });

    expect(instance.is("started")).toBe(false);

    instance.go();
  });
});

test("Clears out remnants of previous instances correctly.", () => {
  setHTML`
    <div>
      <span id="element">
        Previous string.
      </span>
    </div>
  `;

  let instance = new TypeIt("#element", {
    ...args[1],
    strings: "My string.",
  });

  expect(!instance.getOptions().strings[0].includes("ti-cursor")).toEqual(true);
});

test("Typing doesn't end with a break tag.", () => {
  setHTML`<div>
    <span id="element"></span>
  </div>`;

  return new Promise((resolve) => {
    const element = document.querySelector("#element");
    new TypeIt("#element", {
      ...args[1],
      strings: ["One string.", "Two string.", "Three string."],
      afterComplete: () => {
        expect(element.innerHTML.endsWith("<br>")).not.toBe(true);
        resolve();
      },
    }).go();
  });
});

test("Should skip over empty strings.", () => {
  const instance = new TypeIt("#element", {
    strings: ["", "A", "", "B"],
  });

  expect(instance.getQueue().getItems()).toHaveLength(14);
});

describe("go()", () => {
  test("Attaches cursor correctly.", () => {
    return new Promise((resolve) => {
      args[1].afterComplete = () => {
        let cursorNode = document.querySelector(".ti-cursor");
        let element = document.getElementById("element");

        expect(element.dataset.typeitId).toEqual(
          cursorNode.dataset.tiAnimationId,
        );
        expect(cursorNode.style.visibility).toEqual("");
        expect(cursorNode).not.toBeNull();
        resolve();
      };

      instance = new TypeIt(...args);

      expect(document.querySelector(".ti-cursor")).toBeNull();
      instance.go();
    });
  });

  test("Attaches hidden cursor when option is disabled.", () => {
    return new Promise((resolve) => {
      args[1].cursor = false;
      args[1].afterComplete = () => {
        let cursorNode = document.querySelector(".ti-cursor");
        expect(cursorNode).not.toBeNull();
        expect(cursorNode.style.visibility).toEqual("hidden");

        resolve();
      };
      instance = new TypeIt(...args);

      let cursorNode = document.querySelector(".ti-cursor");
      expect(cursorNode).toBeNull();
      instance.go();
    });
  });
});

describe("type()", () => {
  test("Should bookend action with same options when no options passed.", () => {
    instance = new TypeIt("#element").type("!");

    let items = instance.getQueue().getItems();

    expect(items[2].func.constructor.name).toEqual("AsyncFunction");
    expect(items[4].func.constructor.name).toEqual("AsyncFunction");
    expect(items).toHaveLength(6);
  });

  test("Should temporarily update options when specified.", () => {
    instance = new TypeIt("#element").type("!", { speed: 501 });

    let items = instance.getQueue().getItems();

    expect(items[2].func.constructor.name).toEqual("AsyncFunction");
    expect(items[4].func.constructor.name).toEqual("AsyncFunction");
    expect(items).toHaveLength(6);
  });

  test("Should queue pause after string when defined.", () => {
    instance = new TypeIt("#element").type("!", { delay: 300 });
    let last = getLast(instance.getQueue().getItems());
    expect(last).toMatchSnapshot();
  });

  test("Should queue pause correctly when options are passed.", () => {
    instance = new TypeIt("#element").type("!", { speed: 50, delay: 200 });
    let last = getLast(instance.getQueue().getItems());
    expect(last).toMatchSnapshot();
  });

  test("Should queue string when passed as function.", () => {
    instance = new TypeIt("#element").type("a");
    let functionalInstance = new TypeIt("#element").type(() => "a");

    expect(instance.getQueue().getItems()).toHaveLength(
      functionalInstance.getQueue().getItems().length,
    );
  });
});

describe("move()", () => {
  test("Should bookend action with same options when no options passed.", () => {
    instance = new TypeIt("#element").move(1);
    const queueItems = instance.getQueue().getItems();

    const firstQueueItem = queueItems.shift();
    expect(firstQueueItem.func).toBe(undefined);

    queueItems.forEach((item) => {
      expect(item.func.constructor.name).toEqual("Function");
    });
  });

  test("Should temporarily update options when specified.", () => {
    instance = new TypeIt("#element").move(null, { speed: 601, to: "END" });

    expect(instance.getQueue().getItems()).toMatchSnapshot();
  });

  test("Should queue pause after string when defined.", () => {
    instance = new TypeIt("#element").move(1, { delay: 300 });
    let last = getLast(instance.getQueue().getItems());

    expect(last).toMatchSnapshot();
  });

  test("Should queue pause correctly when options are passed.", () => {
    instance = new TypeIt("#element").move(1, { speed: 50, delay: 200 });
    let last = getLast(instance.getQueue().getItems());
    expect(last).toMatchSnapshot();
  });

  test("Should queue when passed as function.", () => {
    instance = new TypeIt("#element").move(9);
    let functionalInstance = new TypeIt("#element").move(() => 9);

    expect(instance.getQueue().getItems()).toHaveLength(
      functionalInstance.getQueue().getItems().length,
    );
  });
});

describe("delete()", () => {
  test("Should bookend action with same options when no options passed.", () => {
    instance = new TypeIt("#element").delete(1);
    const items = instance.getQueue().getItems();

    expect(items).toHaveLength(4);
    expect(items[2].func.name).toEqual("bound #delete");
  });

  test("Should temporarily update options when specified.", () => {
    instance = new TypeIt("#element").delete(null, { deleteSpeed: 201 });
    expect(instance.getQueue().getItems()).toMatchSnapshot();
  });

  test("Should queue pause after string when defined.", () => {
    instance = new TypeIt("#element").delete(3, { delay: 300 });
    let last = getLast(instance.getQueue().getItems());
    expect(last).toMatchSnapshot();
  });

  test("Should queue pause correctly when options are passed.", () => {
    instance = new TypeIt("#element").delete(3, { speed: 50, delay: 200 });
    let last = getLast(instance.getQueue().getItems());
    expect(last).toMatchSnapshot();
  });

  test("Should queue pause correctly when single digit is passed.", () => {
    instance = new TypeIt("#element").delete(3, { speed: 50, delay: 50 }, 200);
    let last = getLast(instance.getQueue().getItems());
    expect(last).toMatchSnapshot();
  });

  test("Should queue when passed as function.", () => {
    instance = new TypeIt("#element").delete(2);
    let functionalInstance = new TypeIt("#element").delete(() => 2);

    let instanceQueue = instance.getQueue().getItems();
    let functionalInstanceQueue = functionalInstance.getQueue().getItems();

    expect(instanceQueue.length).toEqual(functionalInstanceQueue.length);
  });
});

describe("break()", () => {
  test("Should should queue break character object.", () => {
    instance = new TypeIt("#element").break();
    expect(instance.getQueue().getItems()).toMatchSnapshot();
  });
});

describe("empty()", () => {
  test("Should empty out element when called with no cursor.", () => {
    return new Promise((resolve) => {
      args[1].cursor = false;
      element.innerHTML = "existing text";

      args[1].afterComplete = function () {
        expect(element.childNodes).toHaveLength(1);
        resolve();
      };

      const instance = new TypeIt(...args);
      instance.empty().go();
    });
  });

  describe("addSplitPause()", () => {
    test("Adds even split pause around strings.", () => {
      args[1].strings = [];
      instance = new TypeIt(...args);
      expect(instance.getQueue().getItems()).toMatchSnapshot();
    });

    test("Adds different even split pause around strings.", () => {
      args[1].strings = ["ABC", "EFG"];
      args[1].nextStringDelay = 1000;

      instance = new TypeIt(...args);

      expect(instance.getQueue().getItems()).toMatchSnapshot();
    });

    test("Adds split pause around strings when value is array.", () => {
      args[1].strings = ["ABC", "EFG"];
      args[1].nextStringDelay = [100, 500];

      instance = new TypeIt(...args);

      expect(instance.getQueue().getItems()).toMatchSnapshot();
    });

    test("Inserts split pause around multiple strings.", () => {
      args[1].strings = ["A", "B", "C", "D", "E"];
      instance = new TypeIt(...args);
      expect(instance.getQueue().getItems()).toMatchSnapshot();
    });
  });

  test("Should leave cursor alone when it empties element.", () => {
    return new Promise((resolve) => {
      element.innerHTML = "existing text";

      args[1].afterComplete = function () {
        expect(element.childNodes).toHaveLength(1);
        resolve();
      };

      const instance = new TypeIt(...args);
      instance.empty().go();
    });
  });
});

describe("reset()", () => {
  test("Successfully resets when called.", () => {
    setHTML`<div>
        <span id="element"></span>
      </div>`;

    let instance = new TypeIt("#element", {
      strings: "This is my string!",
    }).go();

    instance.destroy();

    expect(instance.is("destroyed")).toBe(true);

    instance = instance.reset();

    //-- Ensure the arguments that define these properties were passed.
    expect(instance.getOptions()).toMatchSnapshot();

    expect(instance.is("completed")).toBe(false);
    expect(instance.is("destroyed")).toBe(false);
  });

  test("Wipes out element contents.", () => {
    return new Promise((resolve) => {
      setHTML`<div>
        <span id="element"></span>
      </div>`;

      let instance;
      let element = document.querySelector("#element");

      instance = new TypeIt("#element", {
        speed: 0,
        strings: "Hi.",
        afterComplete: () => {
          expect(element.innerHTML).toEqual(
            expect.stringMatching(
              /Hi.<span class="ti-cursor" data-ti-animation-id=".+">|<\/span>/,
            ),
          );
          instance = instance.reset();
          expect(element.innerHTML).toEqual("");
          resolve();
        },
      }).go();
    });
  });

  test("Wipes out contents when it's an input.", () => {
    return new Promise((resolve) => {
      setHTML`<div>
        <input id="anInput">
      </div>`;

      let el = document.querySelector("#anInput");
      let inputInstance = new TypeIt("#anInput", {
        speed: 0,
        strings: "Hi.",
        afterComplete: () => {
          expect(el.value).toEqual("Hi.");
          inputInstance.reset();
          expect(el.value).toEqual("");
          resolve();
        },
      }).go();
    });
  });

  describe("rebuilder function is provided", () => {
    test("Rebuilds queue and executes it if specified.", () => {
      return new Promise((resolve) => {
        setHTML`<div>
          <span id="element"></span>
        </div>`;

        let hasCompletedOnce = false;
        let el = document.querySelector("#element");
        let instance = new TypeIt("#element", {
          speed: 0,
          afterComplete: () => {
            // After the second "run," the HTML should contain whatever the
            // second rebuilt queue instructed to run.
            if (hasCompletedOnce) {
              expect(el.innerHTML).toMatch(/^second<span/);
              return resolve();
            }

            instance.reset((i) => i.type("second")).go();
            hasCompletedOnce = true;
          },
        })
          .type("first")
          .go();
      });
    });
  });
});

describe("destroy()", () => {
  test("Destroys instances successfully.", () => {
    setHTML`<div>
      <span id="element"></span>
    </div>`;

    const instance = new TypeIt("#element", {
      strings: "This is my string!",
    }).go();

    expect(instance.is("destroyed")).toBe(false);

    instance.destroy();

    expect(document.body.querySelector(".ti-cursor")).toEqual(null);
  });
});
