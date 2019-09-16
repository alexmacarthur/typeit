import wrapCharacter from "../../src/helpers/wrapCharacter";

test("Should wrap a single character in a `.ti-char` class.", () => {
  let result = wrapCharacter("a");
  expect(result).toBe(`<i class="ti-char">a</i>`);
});

test("Should wrap multiple characters when they're not an array.", () => {
  let result = wrapCharacter("<span>b</span>");
  expect(result).toBe(`<i class="ti-char"><span>b</span></i>`);
});
