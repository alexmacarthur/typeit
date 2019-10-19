import TypeIt from "../src/TypeIt.js";

let instance;

beforeEach(() => {
  document.body.innerHTML = `
    <div>
      <span id="element"></span>
    </div>
  `;

  instance = new TypeIt("#element");
});

test("Initial queue only contains startDelay pause.", () => {
  expect(instance.instances[0].queue).toMatchSnapshot();
});

test("Returns an object with expected properties.", () => {
  expect(Object.keys(instance).sort()).toMatchSnapshot();
});

test("Defines hard-coded string correctly.", () => {
  document.body.innerHTML = `
    <div>
      <span id="element">Hard-coded string.</span>
    </div>
  `;

  let instance = new TypeIt("#element", {
    strings: ["My string."]
  });

  expect(instance.instances[0].opts.strings).toEqual([
    "Hard-coded string.",
    "My string."
  ]);
});

test("Will not begin until explicitly called.", () => {
  document.body.innerHTML = `<div>'
      <span id="element"></span>
    </div>`;

  const instance = new TypeIt("#element", {
    strings: "hello!"
  });

  expect(instance.is("started")).toBe(false);

  instance.go();

  expect(instance.is("started")).toBe(true);
});

test("Clears out remnants of previous instances correctly.", () => {
  document.body.innerHTML = `
    <div>
      <span id="element">
        Previous string.
      </span>
    </div>
  `;

  let instance = new TypeIt("#element", {
    strings: "My string."
  });

  expect(!instance.instances[0].opts.strings[0].includes("ti-cursor")).toEqual(
    true
  );
});

test("Typing doesn't end with a break tag.", () => {
  document.body.innerHTML = `<div>'
    <span id="element"></span>
  </div>`;

  const instance = new TypeIt("#element", {
    strings: ["One string.", "Two string", "Three string."]
  }).go();

  expect(instance.instances[0].$e.innerHTML.endsWith("<br>")).not.toBe(true);
});

describe("reset()", () => {
  test("Successfully resets when called.", () => {
    document.body.innerHTML = `<div>'
        <span id="element"></span>
      </div>`;

    const instance = new TypeIt("#element", {
      strings: "This is my string!"
    }).go();

    instance.destroy();

    expect(instance.is("destroyed")).toBe(true);

    instance.reset();

    //-- Ensure the arguments that define these properties were passed.
    expect(instance.instances[0].$e).not.toBe(undefined);
    expect(instance.instances[0].opts).not.toBe(undefined);
    expect(instance.instances).toHaveLength(1);
    expect(instance.is("completed")).toBe(false);
    expect(instance.is("destroyed")).toBe(false);
  });
});

describe("destroy()", () => {
  test("Destroys instances successfully.", () => {
    document.body.innerHTML = `<div>'
      <span id="element"></span>
    </div>`;

    const instance = new TypeIt("#element", {
      strings: "This is my string!"
    }).go();

    expect(instance.is("destroyed")).toBe(false);

    instance.destroy();

    expect(instance.instances[0].timeouts).toEqual([]);
    expect(document.body.querySelector(".ti-cursor")).toEqual(null);
  });
});
