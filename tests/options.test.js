import TypeIt from "../src/typeit";

test("Cursor should function by default.", () => {
  document.body.innerHTML = `<div>'
      <span id="element"></span>
    </div>`;

  const instance = new TypeIt("#element", {
    strings: ["This should have a default cursor."]
  });

  let cursorCharacter = document
    .getElementById("element")
    .querySelector(".ti-cursor").innerHTML;

  expect(cursorCharacter).toBe("|");
});

test("Changes cursor character correctly.", () => {
  document.body.innerHTML = `<div>'
      <span id="element"></span>
    </div>`;

  const instance = new TypeIt("#element", {
    strings: ["This should have a custom cursor."],
    cursorChar: "$"
  });

  let cursorCharacter = document
    .getElementById("element")
    .querySelector(".ti-cursor").innerHTML;

  expect(cursorCharacter).toBe("$");
});

test("Turning off cursor should work.", () => {
  document.body.innerHTML = `<div>'
      <span id="element"></span>
    </div>`;

  const instance = new TypeIt("#element", {
    strings: ["This should have no cursor."],
    cursor: false
  });

  let visibilityStyle = document.getElementById("element").style.visibility;

  expect(visibilityStyle).toBe("");
});
