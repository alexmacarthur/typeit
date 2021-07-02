import insertIntoElement, {
  findPrintedNode,
  isLastElement,
} from "../../src/helpers/insertIntoElement";
import getParsedBody from "../../src/helpers/getParsedBody";

let targetElement;

beforeEach(() => {
  targetElement = document.createElement("span");
  targetElement.setAttribute("data-typeit-id", "something");
});

test("Should insert a simple character correctly.", () => {
  let charObj = {
    node: getParsedBody("x").firstChild,
    content: "x",
  };

  insertIntoElement(targetElement, charObj);
  expect(targetElement.innerHTML).toBe(`x`);
});

test("Should insert an HTML character object.", () => {
  let characterObject = {
    // Remember: must be a text node. But we want it to be a text node as a
    // descendent to a SPAN element.
    node: getParsedBody("<span>y</span>").querySelector("span").firstChild,
    content: "y",
  };

  setHTML`
    <span data-typeit-id="9">
      <i class="ti-cursor">|</i>
    </span>
  `;

  targetElement = document.querySelector("span");
  let cursor = document.querySelector(".ti-cursor");

  insertIntoElement(targetElement, characterObject, cursor);

  expect(targetElement.innerHTML).toEqual(
    '<span>y</span><i class="ti-cursor">|</i>'
  );
});

test("Should insert a nested character object.", () => {
  let characterObject = {
    node: getParsedBody("<em><span>y</span></em>").querySelector("span")
      .firstChild,
    content: "y",
  };
  targetElement.innerHTML = `<em></em>`;
  insertIntoElement(targetElement, characterObject);
  expect(targetElement.innerHTML).toEqual("<em><span>y</span></em>");
});

test("Should insert content into input.", () => {
  let charObj = {
    node: null,
    content: "some value",
  };

  setHTML(`
    <div>
      <input id="inputElement" type="text" />
    </div>
  `);

  targetElement = document.getElementById("inputElement");

  insertIntoElement(targetElement, charObj);

  expect(targetElement.value).toBe("some value");
});

test("Should insert raw HTML content into input.", () => {
  let charObj = {
    node: null,
    content: "<span>sup</span>",
  };

  setHTML`
    <div>
      <input id="inputElement" type="text" />
    </div>
  `;

  targetElement = document.getElementById("inputElement");

  insertIntoElement(targetElement, charObj);

  expect(targetElement.value).toBe("<span>sup</span>");
});

test("Should insert before cursor when element is top-level.", () => {
  let charObj = {
    node: null,
    content: "Hello",
  };

  setHTML`
    <span data-typeit-id="9">
      <i class="ti-cursor">|</i>
    </span>
  `;

  targetElement = document.querySelector("span");
  let cursor = document.querySelector(".ti-cursor");

  insertIntoElement(targetElement, charObj, cursor);

  expect(document.body.innerHTML).toMatchSnapshot();
});

test("Should not insert into cursor node when a <span> is passed.", () => {
  setHTML`<h1><span>y</span><span class="ti-cursor">|</span></h1>`;

  targetElement = document.querySelector("h1");
  let cursor = document.querySelector(".ti-cursor");

  insertIntoElement(
    targetElement,
    {
      node: getParsedBody("<span>y</span>x").firstChild,
      content: "x",
    },
    cursor
  );

  expect(document.body.innerHTML).toMatchSnapshot();
});

test("Types HTML node when defined.", () => {
  let contentEl = document.createElement("STRONG");
  contentEl.innerText = "howdy";

  let charObj = {
    node: null,
    content: contentEl,
  };

  setHTML`
      <span data-typeit-id="9">
        <i class="ti-cursor">|</i>
      </span>
    `;

  targetElement = document.querySelector("span");
  let cursor = document.querySelector(".ti-cursor");

  insertIntoElement(targetElement, charObj, cursor);

  expect(document.body.innerHTML).toMatchSnapshot();
});

describe("findPrintedNode()", () => {
  test("Finds correct node in element.", () => {
    setHTML`
      <span data-typeit-id="9">
        <strong id="strongTag"></strong>
        <i class="ti-cursor">|</i>
      </span>
    `;

    let parentElement = document.querySelector("span");
    let node = document.querySelector("#strongTag");

    let result = findPrintedNode(node, parentElement);
    expect(result.tagName).toBe("STRONG");
  });

  test("Finds last node in element, even when there are several.", () => {
    setHTML`
      <span data-typeit-id="9">
        <strong>first</strong>
        <strong>second</strong>
        <strong>third</strong>
        <i class="ti-cursor">|</i>
      </span>
    `;

    let parentElement = document.querySelector("span");
    let node = document.querySelector("strong");
    let result = findPrintedNode(node.cloneNode(), parentElement);

    expect(result.outerHTML).toBe("<strong>third</strong>");
  });

  test("Returns undefined when node isn't found.", () => {
    setHTML`
      <span data-typeit-id="9">
        <strong id="strongTag"></strong>
        <i class="ti-cursor">|</i>
      </span>
    `;

    let parentElement = document.querySelector("span");
    let node = document.createElement("EM");

    let result = findPrintedNode(node, parentElement);

    expect(result).toBe(undefined);
  });
});

describe("isLastElement()", () => {
  test("Returns true when node doesn't have siblings.", () => {
    setHTML`this is some text. <span id="el">this is the last element</span>`;

    let el = document.getElementById("el");
    let result = isLastElement(el);
    expect(result).toBe(true);
  });

  test("Returns false when node has sibling element.", () => {
    setHTML`this is some text. <span id="el">this is the last element</span><span id="el2"></span>`;

    let el = document.getElementById("el");
    let result = isLastElement(el);
    expect(result).toBe(false);
  });

  test("Returns false when node has text sibing.", () => {
    setHTML`this is some text. <span id="el">this is the last element</span> more text!`;

    let el = document.getElementById("el");
    let result = isLastElement(el);
    expect(result).toBe(false);
  });

  test("Returns true when node has no sibling, ignoring node.", () => {
    setHTML`this is some text. <span id="el">this is the last element</span><span id="ignoredEl"></span>`;

    let el = document.getElementById("el");
    let ignoredEl = document.getElementById("ignoredEl");
    let result = isLastElement(el, ignoredEl);
    expect(result).toBe(true);
  });

  test("Returns false when node has sibling, ignoring node.", () => {
    setHTML`this is some text. <span id="el">this is the last element</span>holla<span id="ignoredEl"></span>`;

    let el = document.getElementById("el");
    let ignoredEl = document.getElementById("ignoredEl");
    let result = isLastElement(el, ignoredEl);
    expect(result).toBe(false);
  });
});
