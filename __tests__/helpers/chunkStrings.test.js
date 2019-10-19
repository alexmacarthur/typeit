import {
  convertNodesToChunks,
  extractChildTextNodes,
  getNodeAttributes,
  transformNodeToQueueItems,
  isNonBreakElement,
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

describe("getNodeAttributes()", () => {
  test("Gets attributes from node.", () => {
    let node = {
      attributes: [
        {
          name: "att1",
          nodeValue: "attValue1"
        },
        {
          name: "att2",
          nodeValue: "attValue1"
        }
      ]
    };

    let result = getNodeAttributes(node);

    expect(result).toMatchSnapshot();
  });
});

describe("extractChildTextNodes()", () => {
  test("Returns array with text nodes expanded.", () => {
    let parser = new DOMParser();
    let doc = parser.parseFromString(
      "<span>This is my <em>string.</em></span>",
      "text/html"
    );
    let element = doc.body.querySelector("span");

    let result = extractChildTextNodes(element);

    expect(result).toMatchSnapshot();
  });

  test("Returns correct array with only text nodes.", () => {
    let parser = new DOMParser();
    let doc = parser.parseFromString(
      "<span>Nothing but strings in here.</span>",
      "text/html"
    );
    let element = doc.body.querySelector("span");

    let result = extractChildTextNodes(element);

    expect(result).toMatchSnapshot();
  });

  test.only("Returns correct array with only non-text nodes.", () => {
    let parser = new DOMParser();
    let doc = parser.parseFromString(
      "<span><i>Hello, </i><em>buddy!</em></span>",
      "text/html"
    );
    let element = doc.body.querySelector("span");

    let result = extractChildTextNodes(element);

    expect(result).toMatchSnapshot();
  });
});

describe("transformNodeToQueueItems()", () => {
  test("Transforms node with no specified ancestors into queue items.", () => {
    let parser = new DOMParser();
    let doc = parser.parseFromString("<span>Hello, pal.</span>", "text/html");
    let element = doc.body.querySelector("span");

    let result = transformNodeToQueueItems(element);

    expect(result).toMatchSnapshot();
  });

  test("Transforms node with specified ancestors.", () => {
    let parser = new DOMParser();
    let doc = parser.parseFromString("<span>Hello, pal.</span>", "text/html");
    let element = doc.body.querySelector("span");

    let result = transformNodeToQueueItems(element, ["div", "span"]);

    expect(result).toMatchSnapshot();
  });

  test("Attaches attributes as node is transformed.", () => {
    let parser = new DOMParser();
    let doc = parser.parseFromString(
      "<span class='my-class' data-att='my-att'>Hello, pal.</span>",
      "text/html"
    );
    let element = doc.body.querySelector("span");

    let result = transformNodeToQueueItems(element);

    expect(result).toMatchSnapshot();
  });

  test("Transforms node with nested nodes.", () => {
    let parser = new DOMParser();
    let doc = parser.parseFromString(
      "<span>Hello. <em>What is up?</em> See you!</span>",
      "text/html"
    );
    let element = doc.body.querySelector("span");

    let result = transformNodeToQueueItems(element);

    expect(result).toMatchSnapshot();
  });
});

describe("extractChildTextNodes()", () => {
  test("Returns text as a split array", () => {
    document.body.innerHTML = "This is my body";

    let result = extractChildTextNodes(document.body);

    expect(result).toMatchSnapshot();
  });

  test("Splits text and leaves nodes as they are.", () => {
    document.body.innerHTML =
      "This is my body <strong>with some bold text.</strong>";

    let result = extractChildTextNodes(document.body);

    expect(result).toMatchSnapshot();
  });
});

describe("convertNodesToChunks()", () => {
  test("Correctly processes raw queue with one element in it.", () => {
    document.body.innerHTML =
      "This is my body <strong>with some bold text.</strong>";
    let rawQueue = extractChildTextNodes(document.body);

    let result = convertNodesToChunks(rawQueue);

    expect(result).toMatchSnapshot();
  });

  test("Correctly processes raw queue with multiple element in it.", () => {
    document.body.innerHTML =
      "This is my body <strong>with some bold text.</strong> and <i>italicized text.</i>";
    let rawQueue = extractChildTextNodes(document.body);

    let result = convertNodesToChunks(rawQueue);

    expect(result).toMatchSnapshot();
  });

  test("Correctly processes raw queue with nested elements in it.", () => {
    document.body.innerHTML =
      'This is my body <strong data-test="test-attribute">with some bold <i class="test-class">and italicized</i> text.</strong>';
    let rawQueue = extractChildTextNodes(document.body);
    let result = convertNodesToChunks(rawQueue);
    expect(result).toMatchSnapshot();
  });
});

describe("isNonBreakElement()", () => {
  test("Returns true when non-break element is passed.", () => {
    let result = isNonBreakElement(document.createElement("SPAN"));
    expect(result).toBe(true);
  });

  test("Returns false when break element is passed.", () => {
    let result = isNonBreakElement(document.createElement("BR"));
    expect(result).toBe(false);
  });

  test("Returns false non-HTML element is provided.", () => {
    let result = isNonBreakElement("sup");
    expect(result).toBe(false);
  });
});

describe("maybeChunkStringAsHtml()", () => {
  test("Should return noderized string when setting is enabled.", () => {
    expect(
      maybeChunkStringAsHtml("A <em>fancy</em> string.")
    ).toMatchSnapshot();
  });

  test("Should leave string be, but split it into array when setting is disabled.", () => {
    expect(
      maybeChunkStringAsHtml("A <em>fancy</em> string.", false)
    ).toMatchSnapshot();
  });
});
