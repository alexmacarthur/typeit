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
