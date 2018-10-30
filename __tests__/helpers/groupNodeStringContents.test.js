import groupNodeStringContents from "../../src/helpers/groupNodeStringContents";

test("Correctly groups a single tag with contents.", () => {
  let contents = [
    {
      tag: "SPAN",
      attributes: [],
      content: "a",
      isFirstCharacter: true
    },
    {
      tag: "SPAN",
      attributes: [],
      content: "b",
      isFirstCharacter: false
    },
    {
      tag: "SPAN",
      attributes: [],
      content: "c",
      isFirstCharacter: false
    }
  ];

  expect(groupNodeStringContents(contents)).toEqual(["<span>abc</span>"]);
});

test("Correctly groups a adjacent tags with contents.", () => {
  let contents = [
    {
      tag: "SPAN",
      attributes: [],
      content: "a",
      isFirstCharacter: true,
      isLastCharacter: false
    },
    {
      tag: "SPAN",
      attributes: [],
      content: "b",
      isFirstCharacter: false
    },
    {
      tag: "SPAN",
      attributes: [],
      content: "c",
      isFirstCharacter: false,
      isLastCharacter: true
    },
    {
      tag: "A",
      attributes: [],
      content: "d",
      isFirstCharacter: true
    },
    {
      tag: "A",
      attributes: [],
      content: "e",
      isFirstCharacter: false
    },
    {
      tag: "A",
      attributes: [],
      content: "f",
      isFirstCharacter: false,
      isLastCharacter: true
    }
  ];

  expect(groupNodeStringContents(contents)).toEqual([
    "<span>abc</span>",
    "<a>def</a>"
  ]);
});

test("Correctly groups multiple tags with contents in between.", () => {
  let contents = [
    {
      tag: "SPAN",
      attributes: [],
      content: "a",
      isFirstCharacter: true,
      isLastCharacter: false
    },
    {
      tag: "SPAN",
      attributes: [],
      content: "b",
      isFirstCharacter: false
    },
    {
      tag: "SPAN",
      attributes: [],
      content: "c",
      isFirstCharacter: false,
      isLastCharacter: true
    },
    "x",
    {
      tag: "A",
      attributes: [],
      content: "d",
      isFirstCharacter: true
    },
    {
      tag: "A",
      attributes: [],
      content: "e",
      isFirstCharacter: false
    },
    {
      tag: "A",
      attributes: [],
      content: "f",
      isFirstCharacter: false,
      isLastCharacter: true
    }
  ];

  expect(groupNodeStringContents(contents)).toEqual([
    "<span>abc</span>",
    "x",
    "<a>def</a>"
  ]);
});

test("Correctly groups tags with text on both ends.", () => {
  let contents = [
    "x",
    {
      tag: "SPAN",
      attributes: [],
      content: "a",
      isFirstCharacter: true,
      isLastCharacter: false
    },
    {
      tag: "SPAN",
      attributes: [],
      content: "b",
      isFirstCharacter: false
    },
    {
      tag: "SPAN",
      attributes: [],
      content: "c",
      isFirstCharacter: false,
      isLastCharacter: true
    },
    "y"
  ];

  expect(groupNodeStringContents(contents)).toEqual([
    "x",
    "<span>abc</span>",
    "y"
  ]);
});

test("Correctly groups strings with self-closing tags.", () => {
  let contents = [
    "x",
    {
      tag: "BR",
      attributes: [],
      content: null
    },
    "y"
  ];

  expect(groupNodeStringContents(contents)).toEqual(["x", "<br>", "y"]);
});

test("Correctly groups multiple tags with contents in between.", () => {
  let contents = [
    {
      tag: "SPAN",
      attributes: [],
      content: "a",
      isFirstCharacter: true,
      isLastCharacter: false
    },
    {
      tag: "SPAN",
      attributes: [],
      content: "b",
      isFirstCharacter: false
    },
    {
      tag: "SPAN",
      attributes: [],
      content: "c",
      isFirstCharacter: false,
      isLastCharacter: true
    },
    "x",
    {
      tag: "A",
      attributes: [],
      content: "d",
      isFirstCharacter: true
    },
    {
      tag: "A",
      attributes: [],
      content: "e",
      isFirstCharacter: false
    },
    {
      tag: "A",
      attributes: [],
      content: "f",
      isFirstCharacter: false,
      isLastCharacter: true
    }
  ];

  expect(groupNodeStringContents(contents)).toEqual([
    "<span>abc</span>",
    "x",
    "<a>def</a>"
  ]);
});
