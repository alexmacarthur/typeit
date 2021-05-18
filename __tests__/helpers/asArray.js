import asArray from "../../src/helpers/asArray";

test("Will turn string into an array with a single item.", () => {
  expect(asArray("This is just a standard string.")).toEqual([
    "This is just a standard string.",
  ]);
});
