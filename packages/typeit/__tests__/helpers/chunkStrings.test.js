import {
  chunkStringAsHtml,
  maybeChunkStringAsHtml,
  walkElementNodes,
} from "../../src/helpers/chunkStrings";
import expandTextNodes from "../../src/helpers/expandTextNodes";

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
    "This is some text with HTML at the <em>end.</em>"
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

describe("walkElementNodes()", () => {
  test("Gathers correct number of nodes with original parents attached.", () => {
    setHTML`<h2 id="heading">A<span>B<small>C</small></span></h2>`;

    const el = expandTextNodes(document.getElementById("heading"));
    const result = walkElementNodes(el);
    const thirdNode = result[2];

    // "B" should have an original parent of the <span>.
    expect(thirdNode.originalParent).toMatchObject(
      document.querySelector("span")
    );

    // Includes each text node, and separate nodes for the parent elements themselves.
    expect(result.length).toEqual(5);
  });

  test("Reverses nodes when parameter is passed.", () => {
    setHTML`<h2 id="heading">ABC</h2>`;

    const el = expandTextNodes(document.getElementById("heading"));
    const result = walkElementNodes(el, true);

    expect(result[0].textContent).toEqual("C");
  });

  test("Excludes cursor.", () => {
    setHTML`<h2 id="heading"><span>123</span><i class="ti-cursor">|</i></h2>`;

    const el = expandTextNodes(document.getElementById("heading"));
    const result = walkElementNodes(el);
    const cursor = result.find((n) => n?.classList?.contains("ti-cursor"));

    expect(cursor).toBe(undefined);
    expect(result).toHaveLength(4);
  });
});
