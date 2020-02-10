import {
  chunkStringAsHtml,
  maybeChunkStringAsHtml
} from "../../src/helpers/chunkStrings";

beforeEach(() => {
  document.body.innerHTML = "";
});

test("Parses normal string correctly.", () => {
  let result = chunkStringAsHtml("Hello, this is my string.");

  expect(result).toMatchSnapshot();
});

test("Parses single HTML tag.", () => {
  let result = chunkStringAsHtml(
    "Hello, this is some <strong>bold</strong> text."
  );

  expect(result).toMatchSnapshot();
});

test("Parses multiple HTML tags.", () => {
  let result = chunkStringAsHtml(
    "Hello, this is some <strong>bold</strong> text, and some <i>italicized</i> text."
  );

  expect(result).toMatchSnapshot();
});

test("Parses HTML tag at beginning of string.", () => {
  let result = chunkStringAsHtml(
    "<strong>Hello!</strong> This is some text with HTML at the beginning."
  );

  expect(result).toMatchSnapshot();
});

test("Parses HTML tag at end of string.", () => {
  let result = chunkStringAsHtml(
    "This is some text with HTML at the <em>beginning.</em>"
  );

  expect(result).toMatchSnapshot();
});

test("Parses HTML tag with attributes.", () => {
  let result = chunkStringAsHtml(
    'This string has an <strong class="strong-class" id="strong-id" data-whatever="data-att">element</strong> with attributes.'
  );

  expect(result).toMatchSnapshot();
});

describe("maybeChunkStringAsHtml()", () => {
  test("Should return noderized string when setting is enabled.", () => {
    expect(
      maybeChunkStringAsHtml("A <em>fancy</em> string.")
    ).toMatchSnapshot();
  });

  test("Should correctly transform non-HTML string as character objects.", () => {
    expect(
      maybeChunkStringAsHtml("A <em>fancy</em> string.", false)
    ).toMatchSnapshot();
  });
});
