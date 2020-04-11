import removeEmptyElements from "../../src/helpers/removeEmptyElements";

test("Empty HTML nodes should be removed from DOM.", () => {
  setHTML`<span id="scope">a<span></span>bc</span>`;
  removeEmptyElements(document.getElementById("scope"));
  expect(document.body.innerHTML).toMatchSnapshot();
});

test("Nested empty HTML nodes should be removed from DOM.", () => {
  setHTML`<span id="scope">ab<span><a></a></span>c</span>`;

  removeEmptyElements(document.getElementById("scope"));
  expect(document.body.innerHTML).toMatchSnapshot();
});

test("Multiple empty HTML nodes should be removed from DOM.", () => {
  setHTML`<span id="scope">a<span></span><span></span>b<em></em>c</span>`;

  removeEmptyElements(document.getElementById("scope"));
  expect(document.body.innerHTML).toMatchSnapshot();
});

test("Multiple nested empty HTML nodes should be removed from DOM.", () => {
  setHTML`<span id="scope">a<span><a><em></em></a></span>b<span><a><em></em></a></span>c</span>`;

  removeEmptyElements(document.getElementById("scope"));
  expect(document.body.innerHTML).toMatchSnapshot();
});

test("Break tags should not be removed.", () => {
  setHTML`<span id="scope">First line.<br>Second line.<br><br/>Third line.</span>`;
  removeEmptyElements(document.getElementById("scope"));
  expect(document.body.innerHTML).toBe(
    '<span id="scope">First line.<br>Second line.<br><br>Third line.</span>'
  );
});
