import Queue from "../src/Queue.js";

let queue;

beforeEach(() => {
  queue = new Queue(["first-action", null, {}]);
});

describe("add()", () => {
  test("It should add steps properly.", () => {
    queue.add(["step1"]);
    queue.add(["step2"]);

    expect(queue.getItems()).toMatchSnapshot();
  });

  test("It should add a step passed as a function.", () => {
    const myFunc = () => "func!";
    queue.add(myFunc);
    queue.add(myFunc);
    queue.add(myFunc);
    expect(queue.getItems()).toMatchSnapshot();
  });

  test("It should add multiple steps passed at once.", () => {
    const myFunc = () => "func!";
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
    ["value1", null, { executed: true }],
    ["value2", null, { executed: true }],
    ["value3", null, { executed: false }],
    ["value4", null, { executed: true }],
    ["value5", null, { executed: true }]
  ]);

  queue.reset();

  expect(queue.getItems()).toMatchSnapshot();
});

test("It should set initial steps properly.", () => {
  let items = [
    ["value1", null, {}],
    ["value2", null, {}],
    ["value3", null, {}]
  ];

  let q1 = new Queue(items);

  expect(q1.getItems()).toMatchSnapshot();
});

test("It should only return non-executed items.", () => {
  let items = [
    ["value1", null, { executed: true }],
    ["value2", null, { executed: false }],
    ["value3", null, {}]
  ];

  let q1 = new Queue(items);

  expect(q1.getItems()).toMatchSnapshot();
});

test("It should return no items if all are executed.", () => {
  let items = [
    ["value1", null, { executed: true }],
    ["value2", null, { executed: true }],
    ["value3", null, { executed: true }]
  ];

  let q1 = new Queue(items);

  expect(q1.getItems()).toEqual([]);
});
