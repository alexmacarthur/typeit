import Queue from "../src/Queue.js";

let queue;

beforeEach(() => {
  queue = new Queue();
});

describe("add()", () => {
  test("It should add steps properly.", () => {
    expect(queue.getItems()).toEqual([]);

    queue.add(["step1"]);
    queue.add(["step2"]);

    expect(queue.getItems()).toMatchSnapshot();
  });

  test("It should add a step passed as a function.", () => {
    const myFunc = () => 'func!';
    queue.add(myFunc);
    queue.add(myFunc);
    queue.add(myFunc);
    expect(queue.getItems()).toMatchSnapshot();
  });

  test("It should add multiple steps passed at once.", () => {
    const myFunc = () => 'func!';
    queue.add([
      [myFunc, 1],
      [myFunc, 2],
      [myFunc, 3]
    ]);
    expect(queue.getItems()).toMatchSnapshot();
  });
});

test("It should reset properly by marking each item as having not yet been executed.", () => {
  queue.add([
    [
      "value1",
      null,
      { hasBeenExecuted: true }
    ],
    [
      "value2",
      null,
      { hasBeenExecuted: true }
    ],
    [
      "value3",
      null,
      { hasBeenExecuted: false }
    ],
    [
      "value4",
      null,
      { hasBeenExecuted: true }
    ],
    [
      "value5",
      null,
      { hasBeenExecuted: true }
    ]
  ]);

  queue.reset();

  expect(queue.getItems()).toMatchSnapshot();
});

test("It should set initial steps properly.", () => {
  let q1 = new Queue();

  expect(q1.getItems()).toEqual([]);

  let items = [
    [
      "value1",
      null,
      {}
    ],
    [
      "value2",
      null,
      {}
    ],
    [
      "value3",
      null,
      {}
    ]
  ];

  let q2 = new Queue(items);

  expect(q2.getItems()).toMatchSnapshot();
});
