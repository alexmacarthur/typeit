import Queue from "../src/Queue.js";

let queue;

beforeEach(() => {
  queue = new Queue();
});

test("It should add steps properly.", () => {
  expect(queue.waiting).toEqual([]);
  expect(queue.executed).toEqual([]);

  queue.add("step 1");
  queue.add("step 2");

  expect(queue.waiting).toEqual(["step 1", "step 2"]);
  expect(queue.executed).toEqual([]);
});

test("It should reset properly.", () => {
  queue.waiting = [4, 5, 6];
  queue.executed = [1, 2, 3];

  queue.reset();

  expect(queue.waiting).toEqual([1, 2, 3, 4, 5, 6]);
  expect(queue.executed).toEqual([]);
});

test("It should set initial steps properly.", () => {
  let q1 = new Queue();

  expect(q1.waiting).toEqual([]);

  let q2 = new Queue([1, 2, 3]);

  expect(q2.waiting).toEqual([1, 2, 3]);
});
