import toArray from "../../src/helpers/toArray";

test("Will turn string into an array with a single item.", () => {
  expect(toArray("This is just a standard string.")).toEqual([
    "This is just a standard string."
  ]);
});

test("Will split a string with break tags into array.", () => {
  expect(toArray("This<br>is<br>broken<br>up.")).toEqual([
    "This",
    "is",
    "broken",
    "up."
  ]);
});
