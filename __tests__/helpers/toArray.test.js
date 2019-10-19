import toArray from "../../src/helpers/toArray";

test("Will turn string into an array with a single item.", () => {
  expect(toArray("This is just a standard string.")).toEqual([
    "This is just a standard string."
  ]);
});
