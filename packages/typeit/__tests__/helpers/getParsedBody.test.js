import getParsedBody from "../../src/helpers/getParsedBody";

test("Returns body from empty string.", () => {
  let string = "";
  let result = getParsedBody(string);
  expect(result.tagName).toEqual("BODY");
  expect(result.childNodes.length).toBe(0);
});

test("Returns body from simple string.", () => {
  let string = "This is a string.";
  let result = getParsedBody(string);
  expect(result.childNodes.length).toBe(17);
});

test("Returns body from string containing HTML.", () => {
  let string = "This is a <strong>string</strong>.";
  let result = getParsedBody(string);
  expect(result.childNodes.length).toBe(12);
});
