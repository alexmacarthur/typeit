import createNode from "../../src/helpers/createNode";

test("Creates a given tag by string.", () => {
  let result = createNode("SPAN");

  expect(result.outerHTML).toEqual("<span></span>");
});

test("Creates a self-closing tag correctly.", () => {
  let result = createNode("BR");

  expect(result.outerHTML).toEqual("<br>");
});

test("Creates a tag with attributes correctly.", () => {
  let result = createNode("DIV", [
    {
      name: "data-my-attribute",
      value: "my-value"
    },
    {
      name: "id",
      value: "my-id"
    }
  ]);

  expect(result.outerHTML).toEqual(
    `<div data-my-attribute="my-value" id="my-id"></div>`
  );
});

test("Creates a tag with content correctly.", () => {
  let result = createNode("DIV", [], "my content");

  expect(result.outerHTML).toEqual(`<div>my content</div>`);
});
