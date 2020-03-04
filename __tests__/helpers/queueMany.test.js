import queueMany from "../../src/helpers/queueMany";

test("It should copy an action specified number of times.", () => {
  let result = queueMany(5, "action");
  expect(result).toEqual(["action", "action", "action", "action", "action"]);
});

test("It should generate items with each array item set as argument.", () => {
  let result = queueMany(["x", "y", "z"], "action");

  expect(result).toEqual([
    ["action", "x", {}],
    ["action", "y", {}],
    ["action", "z", {}]
  ]);
});

test("It should bookend items correctly.", () => {
  let result = queueMany(["a", "b", "c"], "action", {}, true);

  expect(result).toEqual([
    ["action", "a", { isFirst: true }],
    ["action", "b", {}],
    ["action", "c", { isLast: true }]
  ]);
});
