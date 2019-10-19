import insertIntoElement from "../../src/helpers/insertIntoElement";

let someElement;

beforeEach(() => {
  someElement = document.createElement("SPAN");
});

test("Should insert a simple character correctly.", () => {
  insertIntoElement(someElement, "x");
  expect(someElement.innerHTML).toBe(`x`);
});

test("Should insert a character object.", () => {
  let characterObject = {
    ancestorTree: ["SPAN"],
    attributes: [],
    content: "y",
    isFirstChar: true
  };
  insertIntoElement(someElement, characterObject);

  expect(someElement.innerHTML).toBe(`<span>y</span>`);
});

test("Should insert a nested character object.", () => {
  let characterObject = {
    ancestorTree: ["SPAN", "EM"],
    attributes: [],
    content: "y",
    isFirstChar: false
  };
  someElement.innerHTML = `<em></em>`;
  insertIntoElement(someElement, characterObject);
  expect(someElement.innerHTML).toMatchSnapshot();
});

test("Should insert content into input.", () => {
  setHTML(`
    <div>
      <input id="inputElement" type="text" />
    </div>
  `);

  someElement = document.getElementById("inputElement");

  insertIntoElement(someElement, "some value");

  expect(someElement.value).toBe("some value");
});

test("Should insert raw HTML content into input.", () => {
  setHTML`
    <div>
      <input id="inputElement" type="text" />
    </div>
  `;

  someElement = document.getElementById("inputElement");

  insertIntoElement(someElement, "<span>sup</span>");

  expect(someElement.value).toBe("<span>sup</span>");
});

test("Should insert before cursor when element is top-level.", () => {
  setHTML`
    <span data-typeit-id="9">
      <i class="ti-cursor">|</i>
    </span>
  `;

  someElement = document.querySelector("span");

  insertIntoElement(someElement, "Hello");

  expect(document.body.innerHTML).toMatchSnapshot();
});

test("Should not insert before cursor when target element is not top-level.", () => {
  setHTML`
    <span>
      <i class="ti-cursor">|</i>
    </span>
  `;

  someElement = document.querySelector("span");

  insertIntoElement(someElement, "Hello");

  expect(document.body.innerHTML).toMatchSnapshot();
});
