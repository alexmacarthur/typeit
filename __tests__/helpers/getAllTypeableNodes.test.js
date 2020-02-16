import getAllTypeableNodes from "../../src/helpers/getAllTypeableNodes";

test("Should return the single text node.", () => {
  setHTML`
    <div id="element">
      This is text.
    </div>
  `;

  let el = document.getElementById("element");
  let result = getAllTypeableNodes(el);

  expect(result).toMatchSnapshot();
});

test("Should return multiple text nodes.", () => {
  setHTML`
    <div id="element">
      This is text. <span>And here is more.</span>
    </div>
  `;

  let el = document.getElementById("element");
  let result = getAllTypeableNodes(el);

  expect(result).toMatchSnapshot();
});

test("Should return break tag as separate node.", () => {
  setHTML`
    <div id="element">
      This text will break. <br> It broke.
    </div>
  `;

  let el = document.getElementById("element");
  let result = getAllTypeableNodes(el);

  expect(result).toMatchSnapshot();
});

test("Should return break tags as when they bookend string.", () => {
  setHTML`
    <div id="element">
      <br>Text in the middle</br>
    </div>
  `;

  let el = document.getElementById("element");
  let result = getAllTypeableNodes(el);

  expect(result).toMatchSnapshot();
});

test("Should return correct text nodes when nested deeply.", () => {
  setHTML`
    <div id="element">
      Text #1. <span>Text #2. <em>Text #3.</em>
    </div>
  `;

  let el = document.getElementById("element");
  let result = getAllTypeableNodes(el);

  expect(result).toMatchSnapshot();
});
