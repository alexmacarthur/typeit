import guaranteeThreeKeys from "../../src/helpers/guaranteeThreeKeys";

test("Should add two items when only one exists in each queue item.", () => {
  let queue = [["x"], ["y"], ["z"]];

  let result = guaranteeThreeKeys(queue);

  expect(result).toEqual([
    ["x", null, {}],
    ["y", null, {}],
    ["z", null, {}]
  ]);
});

test("Should add one item when two exist in each queue item.", () => {
  let queue = [
    ["x", "X"],
    ["y", "Y"],
    ["z", "Z"]
  ];

  let result = guaranteeThreeKeys(queue);

  expect(result).toEqual([
    ["x", "X", {}],
    ["y", "Y", {}],
    ["z", "Z", {}]
  ]);
});

test("Shouldn't modify any items when they have three indexes.", () => {
  let queue = [
    ["x", "X", { executed: true }],
    ["y", "Y", { executed: false }],
    ["z", "Z", { executed: false }]
  ];

  let result = guaranteeThreeKeys(queue);

  expect(result).toEqual([
    ["x", "X", { executed: true }],
    ["y", "Y", { executed: false }],
    ["z", "Z", { executed: false }]
  ]);
});
