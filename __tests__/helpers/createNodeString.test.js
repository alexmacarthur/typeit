import createNodeString from "../../src/helpers/createNodeString";

test("Creates a given tag by string.", () => {
  let result = createNodeString({
    tag: "SPAN"
  });

  expect(result).toEqual("<span></span>");
});

test("Creates a self-closing tag correctly.", () => {
  let result = createNodeString({
    tag: "BR"
  });

  expect(result).toEqual("<br>");
});

test("Creates a tag with attributes correctly.", () => {
  let result = createNodeString({
    tag: "DIV",
    attributes: [
      {
        name: "data-my-attribute",
        value: "my-value"
      },
      {
        name: "id",
        value: "my-id"
      }
    ]
  });

  expect(result).toEqual(`<div data-my-attribute="my-value" id="my-id"></div>`);
});

test("Creates a tag with content correctly.", () => {
  let result = createNodeString({
    tag: "DIV",
    content: "my content"
  });

  expect(result).toEqual(`<div>my content</div>`);
});
