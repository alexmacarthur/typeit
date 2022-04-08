import Queue from "../src/Queue";

let queue;

beforeEach(() => {
  queue = new Queue([["first-action", null, {}]]);
});

describe("add()", () => {
  test("It should add steps properly.", () => {
    queue.add([{ func: function first() {} }]);
    queue.add([{ func: function second() {} }]);

    let items = queue.getItems();
    expect(items[1].func.name).toEqual("first");
    expect(items[2].func.name).toEqual("second");
  });

  test("It should add multiple steps passed at once.", () => {
    let func = jest.fn();
    queue.add([{ func }, { func }, { func }]);

    let items = queue.getItems();

    expect(items).toHaveLength(4);

    items.slice(1).forEach((i) => {
      expect(i.func).toEqual(func);
    });
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

  queue.getItems().forEach((i) => {
    expect(i).not.toHaveProperty("done");
  });
});

test("It should set initial steps properly.", () => {
  let items = [{}, {}, {}];

  let q1 = new Queue(items);

  expect(q1.getItems()).toEqual([{ delay: 0 }, { delay: 0 }, { delay: 0 }]);
});

test("It should only return non-done items.", () => {
  let items = [{ done: true }, { done: false }, {}];

  let q1 = new Queue(items);

  expect(q1.getItems()).toHaveLength(2);

  q1.getItems().forEach((i) => {
    expect(i.done).not.toBe(true);
  });
});

test("It should return no items if all are done.", () => {
  let items = [{ done: true }, { done: true }, { done: true }];

  let q1 = new Queue(items);

  expect(q1.getItems()).toEqual([]);
});
