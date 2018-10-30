import TypeIt from "../../src/TypeIt";

test("Cursor should function by default.", () => {
  document.body.innerHTML = `<div>'
      <span id="element"></span>
    </div>`;

  const instance = new TypeIt("#element", {
    strings: ["This should have a default cursor."]
  }).go();

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
  }).go();

  let cursorCharacter = document
    .getElementById("element")
    .querySelector(".ti-cursor").innerHTML;

  expect(cursorCharacter).toBe("$");
});

test("Turning off cursor should work.", () => {
  document.body.innerHTML = `<div>'
      <span id="element"></span>
    </div>`;

  new TypeIt("#element", {
    strings: ["This should have no cursor."],
    cursor: false
  });

  let visibilityStyle = document.getElementById("element").style.visibility;

  expect(visibilityStyle).toBe("");
});

describe("startDelete option.", () => {
  test("Makes hard-coded string the first string to be typed.", () => {
    document.body.innerHTML = `<div>'
      <span id="element">This should be typed first.</span>
    </div>`;

    const instance = new TypeIt("#element", {});

    expect(instance.instances[0].queue.waiting).toMatchSnapshot();

    expect(instance.instances[0].opts.strings).toEqual([
      "This should be typed first."
    ]);
  });

  test("Sets both hard-coded and option-defined strings in correct order.", () => {
    document.body.innerHTML = `<div>'
      <span id="element">This should be typed first.</span>
    </div>`;

    const instance = new TypeIt("#element", {
      strings: "This is another string."
    });

    expect(instance.instances[0].queue.waiting).toMatchSnapshot();

    expect(instance.instances[0].opts.strings).toEqual([
      "This should be typed first.",
      "This is another string."
    ]);
  });

  test("Correctly adds strings also defined by type() companion method.", () => {
    document.body.innerHTML = `<div>'
      <span id="element">This should be typed first.</span>
    </div>`;

    const instance = new TypeIt("#element", {
      strings: "This is another string."
    }).type("And finally, a third.");

    expect(instance.instances[0].queue.waiting).toMatchSnapshot();

    expect(instance.instances[0].opts.strings).toEqual([
      "This should be typed first.",
      "This is another string."
    ]);
  });
});

describe("html option", () => {
  test("It should queue strings as HTML by default.", () => {
    document.body.innerHTML = `
      <div>
        <span id="element"></span>
      </div>
    `;

    const instance = new TypeIt("#element", {
      strings: "This is a <strong>BOLD</strong> string."
    });

    expect(instance.instances[0].queue.waiting).toMatchSnapshot();
  });

  test("It should queue strings as HTML when explicitly set.", () => {
    document.body.innerHTML = `
      <div>
        <span id="element"></span>
      </div>
    `;

    const instance = new TypeIt("#element", {
      strings: "This is a <strong>another BOLD</strong> string.",
      html: true
    });

    expect(instance.instances[0].queue.waiting).toMatchSnapshot();
  });

  test("It should leave strings be when option is disabled.", () => {
    document.body.innerHTML = `
      <div>
        <span id="element"></span>
      </div>
    `;

    const instance = new TypeIt("#element", {
      strings: "This is a <strong>another BOLD</strong> string.",
      html: false
    });

    expect(instance.instances[0].queue.waiting).toMatchSnapshot();
  });
});
