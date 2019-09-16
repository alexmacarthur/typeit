import flatten from "../../src/helpers/flatten";

test("Returns flattened array.", () => {
  let arr = [1, 2, 3, [4, 5, 6], 7];
  expect(flatten(arr)).toEqual([1, 2, 3, 4, 5, 6, 7]);
});

test("Returns flattened array in different order.", () => {
  let arr = [1, 3, [4, 7], 2, 6];
  expect(flatten(arr)).toEqual([1, 3, 4, 7, 2, 6]);
});

test("Leaves regular old array alone.", () => {
  let arr = [9, 8, 7];
  expect(flatten(arr)).toEqual([9, 8, 7]);
});

test("Returns flattened array that contains objects.", () => {
  let arr = [1, 2, [{ prop: 1 }, { prop: 2 }], 3];
  expect(flatten(arr)).toEqual([1, 2, { prop: 1 }, { prop: 2 }, 3]);
});

test("Returns flattened array that contains mixed values in contained array.", () => {
  let arr = [1, 2, [{ prop: 1 }, 9], 3];
  expect(flatten(arr)).toEqual([1, 2, { prop: 1 }, 9, 3]);
});

test("Returns flattened array that contains multiple nested arrays.", () => {
  let arr = [1, 3, [4, 7], 2, 6, [3, 3]];
  expect(flatten(arr)).toEqual([1, 3, 4, 7, 2, 6, 3, 3]);
});
