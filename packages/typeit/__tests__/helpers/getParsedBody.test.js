import getParsedBody from "../../src/helpers/getParsedBody";
import GraphemeSplitter from "grapheme-splitter";
import { defaultGetParsedBody, emojiFiveDigitString } from "./util";

test("Returns body from empty string.", () => {
  let string = "";
  let result = defaultGetParsedBody(string);
  expect(result.tagName).toEqual("BODY");
  expect(result.childNodes.length).toBe(0);
});

test("Returns body from simple string.", () => {
  let string = "This is a string.";
  let result = defaultGetParsedBody(string);
  expect(result.childNodes.length).toBe(17);
});

test("Returns body from string containing HTML.", () => {
  let string = "This is a <strong>string</strong>.";
  let result = defaultGetParsedBody(string);
  expect(result.childNodes.length).toBe(12);
});

test("Returns body from emoji Konami Code.", () => {
  let string = "⬆️⬆️⬇️⬇️⬅️➡️⬅️➡️🅱️🅰️🏁";
  let splitter = new GraphemeSplitter();
  let result = getParsedBody(string, (str) => splitter.splitGraphemes(str));
  expect(result.childNodes.length).toBe(11);
});

test("Returns body from emoji numbers.", () => {
  let string = emojiFiveDigitString;
  let splitter = new GraphemeSplitter();
  let result = getParsedBody(string, (str) => splitter.splitGraphemes(str));
  expect(result.childNodes.length).toBe(5);
});
