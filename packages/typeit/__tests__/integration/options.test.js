import TypeIt from "../../src";

test("Cursor should function by default.", () => {
  setHTML`<div>'
      <span id="element"></span>
    </div>`;

  new TypeIt("#element", {
    strings: ["This should have a default cursor."],
  }).go();

  let cursorCharacter = document
    .getElementById("element")
    .querySelector(".ti-cursor").innerHTML;

  expect(cursorCharacter).toBe("|");
});

test("Changes cursor character correctly.", () => {
  setHTML`<div>'
      <span id="element"></span>
    </div>`;

  new TypeIt("#element", {
    strings: ["This should have a custom cursor."],
    cursorChar: "$",
  }).go();

  let cursorCharacter = document
    .getElementById("element")
    .querySelector(".ti-cursor").innerHTML;

  expect(cursorCharacter).toBe("$");
});

test("Turning off cursor should work.", () => {
  setHTML`<div>'
      <span id="element"></span>
    </div>`;

  new TypeIt("#element", {
    strings: ["This should have no cursor."],
    cursor: false,
  });

  let visibilityStyle = document.getElementById("element").style.visibility;

  expect(visibilityStyle).toBe("");
});

describe("startDelete option.", () => {
  test("Makes hard-coded string the first string to be typed.", () => {
    setHTML`<div>'
      <span id="element">This should be typed first.</span>
    </div>`;

    const instance = new TypeIt("#element", {});

    expect(instance.getQueue().getItems()).toHaveLength(32);

    expect(instance.getOptions().strings).toEqual([
      "This should be typed first.",
    ]);
  });

  test("Sets both hard-coded and option-defined strings in correct order.", () => {
    setHTML`<div>'
      <span id="element">This should be typed first.</span>
    </div>`;

    const instance = new TypeIt("#element", {
      strings: "This is another string.",
    });

    expect(instance.getQueue().getItems()).toHaveLength(62);

    expect(instance.getOptions().strings).toEqual([
      "This should be typed first.",
      "This is another string.",
    ]);
  });

  test("Correctly adds strings also defined by type() companion method.", () => {
    setHTML`<div>'
      <span id="element">This should be typed first.</span>
    </div>`;

    const instance = new TypeIt("#element", {
      strings: "This is another string.",
    }).type("And finally, a third.");

    expect(instance.getQueue().getItems()).toHaveLength(87);

    expect(instance.getOptions().strings).toEqual([
      "This should be typed first.",
      "This is another string.",
    ]);
  });
});

test("Generates correct `nextStringDelay`.", () => {
  setHTML`<div>'
      <span id="element"></span>
    </div>`;

  const instance1 = new TypeIt("#element", {
    nextStringDelay: 500,
    strings: ["Free markets...", "win."],
  });

  let nextStringDelay = instance1.getOptions().nextStringDelay;

  expect(typeof nextStringDelay).toBe("object");
  expect(nextStringDelay[0]).toBe(250);
  expect(nextStringDelay[1]).toBe(250);

  const instance2 = new TypeIt("#element", {
    nextStringDelay: [150, 400],
    strings: ["Free markets...", "win."],
  });

  nextStringDelay = instance2.getOptions().nextStringDelay;

  expect(nextStringDelay[0]).toBe(150);
  expect(nextStringDelay[1]).toBe(400);
});

test("Generates correct `loopDelay`.", () => {
  setHTML`<div>'
      <span id="element"></span>
    </div>`;

  const instance1 = new TypeIt("#element", {
    nextStringDelay: 500,
    strings: ["Free markets...", "win."],
  });

  let loopDelay = instance1.getOptions().loopDelay;

  expect(loopDelay[0]).toBe(375);
  expect(loopDelay[1]).toBe(375);

  const instance2 = new TypeIt("#element", {
    loopDelay: [3000, 5000],
    strings: ["Free markets...", "win."],
  });

  loopDelay = instance2.getOptions().loopDelay;

  expect(typeof loopDelay).toBe("object");
  expect(loopDelay[0]).toBe(3000);
  expect(loopDelay[1]).toBe(5000);
});

describe("html option", () => {
  test("It should queue strings as HTML by default.", () => {
    setHTML`
      <div>
        <span id="element"></span>
      </div>
    `;

    const instance = new TypeIt("#element", {
      strings: "This is a <strong>BOLD</strong> string.",
    });

    expect(instance.getQueue().getItems()).toHaveLength(28);
  });

  test("It should queue strings as HTML when explicitly set.", () => {
    setHTML`
      <div>
        <span id="element"></span>
      </div>
    `;

    const instance = new TypeIt("#element", {
      strings: "This is a <strong>another BOLD</strong> string.",
      html: true,
    });

    expect(instance.getQueue().getItems()).toHaveLength(36);
  });

  test("It should leave strings be when option is disabled.", () => {
    setHTML`
      <div>
        <span id="element"></span>
      </div>
    `;

    const instance = new TypeIt("#element", {
      strings: "This is a <strong>another BOLD</strong> string.",
      html: false,
    });

    expect(instance.getQueue().getItems()).toHaveLength(52);
  });
});

describe("startDelete option", () => {
  test("It should completely remove hard-coded string before typing.", (done) => {
    setHTML`
    <div>
      <span id="element">hard-coded!</span>
    </div>
  `;
    const element = document.getElementById("element");

    new TypeIt(element, {
      strings: "Hello.",
      speed: 0,
      startDelete: true,
      afterComplete: () => {
        expect(element.innerHTML).toEqual(
          expect.stringMatching(/^Hello\.<span class="ti-cursor.*?<\/span>$/)
        );

        done();
      },
    }).go();
  });
});
