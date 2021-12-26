import Queue from "../src/Queue";

let queue;

beforeEach(() => {
  queue = new Queue([["first-action", null, {}]]);
});

describe("add()", () => {
  test("It should add steps properly.", () => {
    queue.add([["step1"]]);
    queue.add([["step2"]]);

    expect(queue.getItems()).toMatchSnapshot();
  });

  test("It should add multiple steps passed at once.", () => {
    const myFunc = () => "func!";
    queue.add([
      [myFunc, 1],
      [myFunc, 2],
      [myFunc, 3],
    ]);
    expect(queue.getItems()).toMatchSnapshot();
  });
});

test("It should reset properly by marking each item as having not yet been done.", () => {
  queue.add([
    { done: true },
    { done: true },
    { done: false },
    { done: true },
    { done: true },
  ]);

  queue.reset();

  expect(queue.getItems()).toMatchSnapshot();
});

test("It should set initial steps properly.", () => {
  let items = [{}, {}, {}];

  let q1 = new Queue(items);

  expect(q1.getItems()).toMatchSnapshot();
});

test("It should only return non-done items.", () => {
  let items = [{ done: true }, { done: false }, {}];

  let q1 = new Queue(items);

  expect(q1.getItems()).toMatchSnapshot();
});

test("It should return no items if all are done.", () => {
  let items = [{ done: true }, { done: true }, { done: true }];

  let q1 = new Queue(items);

  expect(q1.getItems()).toEqual([]);
});
