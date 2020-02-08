import Instance from "../src/Instance.js";

let instance;
let args;

beforeEach(() => {
  setHTML`
    <div>
      <span id="element"></span>
    </div>
  `;

  args = {
    element: document.getElementById("element"),
    id: "arbitrary-id",
    options: {
      strings: ["ABC", "EFG"]
    },
    typeit: null,
    queue: []
  };

  instance = new Instance(args);
});

describe("init()", () => {
  test("Attaches cursor correctly.", () => {
    expect(document.querySelector(".ti-cursor")).toBeNull();
    instance.init();
    expect(document.querySelector(".ti-cursor")).not.toBeNull();
  });

  test("Does not attach cursor when none should exist.", () => {
    args.options.cursor = false;
    instance = new Instance(args);
    expect(document.querySelector(".ti-cursor")).toBeNull();
    instance.init();
    expect(document.querySelector(".ti-cursor")).toBeNull();
  });
});

describe("empty()", () => {
  test("Should empty out element when called with no cursor.", async () => {
    args.options.cursor = false;
    instance = new Instance(args);
    instance.$e.innerHTML = "existing text";
    instance.init();
    await instance.empty();
    expect(instance.$e.childNodes).toHaveLength(0);
  });

  test("Should leave cursor alone when it empties element.", async () => {
    instance.$e.innerHTML = "existing text";
    instance.init();
    await instance.empty();
    expect(instance.$e.childNodes).toHaveLength(1);
  });
});

describe("addSplitPause()", () => {
  test("Adds even split pause around strings.", () => {
    expect(instance.queue.waiting).toMatchSnapshot();
  });

  test("Adds different even split pause around strings.", () => {
    let newArgs = Object.assign({}, args, {
      options: {
        strings: ["ABC", "EFG"],
        nextStringDelay: 1000
      }
    });

    instance = new Instance(newArgs);

    expect(instance.queue.waiting).toMatchSnapshot();
  });

  test("Adds split pause around strings when value is array.", () => {
    let newArgs = Object.assign({}, args, {
      options: {
        strings: ["ABC", "EFG"],
        nextStringDelay: [100, 500]
      }
    });

    instance = new Instance(newArgs);

    expect(instance.queue.waiting).toMatchSnapshot();
  });

  test("Inserts split pause around multiple strings.", () => {
    let newArgs = Object.assign({}, args, {
      options: {
        strings: ["A", "B", "C", "D", "E"]
      }
    });

    instance = new Instance(newArgs);

    expect(instance.queue.waiting).toMatchSnapshot();
  });
});
