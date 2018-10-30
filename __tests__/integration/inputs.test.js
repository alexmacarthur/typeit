import TypeIt from "../../src/TypeIt";

test("Recognizes input elements.", () => {
  document.body.innerHTML = `<div>'
      <input id="element"></input>
    </div>`;

  const instance = new TypeIt("#element", {
    strings: ["Free markets...", "win."]
  });

  expect(instance.instances[0].isInput).toBe(true);
});

test("Recognizes textareas.", () => {
  document.body.innerHTML = `<div>'
      <textarea id="element"></textarea>
    </div>`;

  const instance = new TypeIt("#element", {
    strings: ["Free markets...", "win."]
  });

  expect(instance.instances[0].isInput).toBe(true);
});

test("Recognizes non-input elements.", () => {
  document.body.innerHTML = `<div>'
      <span id="element"></span>
    </div>`;

  const instance = new TypeIt("#element", {
    strings: ["Free markets...", "win."]
  });

  expect(instance.instances[0].isInput).toBe(false);
});
