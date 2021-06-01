import queueMany from "../../src/helpers/queueMany";

test("It should generate items with each array item set as argument.", () => {
  let result = queueMany(["x", "y", "z"], "action");

  expect(result).toEqual([
    ["action", "x", {}],
    ["action", "y", {}],
    ["action", "z", {}],
  ]);
});

test("It should bookend items correctly.", () => {
  let result = queueMany(["a", "b", "c"], "action", {}, true);

  expect(result).toEqual([
    ["action", "a", { isFirst: true }],
    ["action", "b", {}],
    ["action", "c", { isLast: true }],
  ]);
});
