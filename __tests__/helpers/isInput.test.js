import isInput from "../../src/helpers/isInput";

test("Recognizes input elements.", () => {
  document.body.innerHTML = `<div>'
    <input id="element"></input>
  </div>`;

  let result = isInput(document.getElementById("element"));

  expect(result).toBe(true);
});

test("Recognizes textareas.", () => {
  document.body.innerHTML = `<div>'
      <textarea id="element"></textarea>
    </div>`;

  let result = isInput(document.getElementById("element"));

  expect(result).toBe(true);
});

test("Recognizes non-input elements.", () => {
  document.body.innerHTML = `<div>'
      <span id="element"></span>
    </div>`;

  let result = isInput(document.getElementById("element"));

  expect(result).toBe(false);
});
