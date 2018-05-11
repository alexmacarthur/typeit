import TypeIt from "../src/typeit";

test("Clears out remnants of previous instances correctly.", () => {
  jest.useFakeTimers();

  document.body.innerHTML = `
    <div>
      <span id="element">
        <span style="display:inline;position:relative;font:inherit;color:inherit;" class="ti-container">Previous string.</span>
      </span>
    </div>
  `;

  let instance = new TypeIt("#element", { strings: "My string." });

  expect(
    !instance.instances[0].options.strings[0].includes("ti-container")
  ).toEqual(true);
});

test("Defines hard-coded string correctly.", () => {
  jest.useFakeTimers();

  document.body.innerHTML = `
    <div>
      <span id="element">
        Hard-coded string.
      </span>
    </div>
  `;

  let instance = new TypeIt("#element", { strings: "My string." });

  expect(instance.instances[0].options.strings).toEqual(["Hard-coded string."]);
});

test("Returns an object with base properties.", () => {
  document.body.innerHTML = `<div>'
      <span id="element"></span>
    </div>`;

  const instance = new TypeIt("#element", {});

  expect(Object.keys(instance).sort()).toEqual(
    ["autoInit", "elements", "id", "instances", "args"].sort()
  );
});

test("Disabling autoInit works.", () => {
  jest.useFakeTimers();

  document.body.innerHTML = `<div>'
      <span id="element"></span>
    </div>`;

  const instance = new TypeIt(
    "#element",
    {
      strings: "hello!"
    },
    false
  );

  jest.runAllTimers();

  expect(instance.hasStarted).toBe(false);

  instance.init();

  expect(instance.hasStarted).toBe(true);
});

test("Successfully resets when called.", () => {
  jest.useFakeTimers();

  document.body.innerHTML = `<div>'
      <span id="element"></span>
    </div>`;

  const instance = new TypeIt("#element", {
    strings: "This is my string!"
  });

  jest.runAllTimers();

  instance.destroy();

  expect(instance.isComplete).toBe(true);
  expect(instance.hasBeenDestroyed).toBe(true);

  instance.reset();

  //-- Ensure the arguments that define these properties were passed.
  expect(instance.instances[0].element).not.toBe(undefined);
  expect(instance.instances[0].id).not.toBe(undefined);
  expect(instance.instances[0].options).not.toBe(undefined);
  expect(instance.instances[0].autoInit).not.toBe(undefined);
  expect(instance.instances[0].typeit).not.toBe(undefined);

  expect(instance.instances).toHaveLength(1);
  expect(instance.isComplete).toBe(false);
  expect(instance.hasBeenDestroyed).toBe(false);
});

test("Destroys instances successfully.", () => {
  jest.useFakeTimers();

  document.body.innerHTML = `<div>'
      <span id="element"></span>
    </div>`;

  const instance = new TypeIt("#element", {
    strings: "This is my string!"
  });

  jest.runAllTimers();

  expect(instance.hasBeenDestroyed).toBe(false);

  instance.destroy();

  expect(instance.instances[0].timeouts).toEqual([]);
  expect(document.body.querySelector(".ti-cursor")).toEqual(null);
});

test("Redefines defaults correctly.", () => {
  document.body.innerHTML = `<div>'
      <span id="element"></span>
    </div>`;

  expect(typeof window.TypeItDefaults).toBe("object");

  window.TypeItDefaults.speed = 25;
  const instance = new TypeIt("#element", {});

  expect(instance.instances[0].options.speed).toEqual(25);
  expect(instance.instances[0].options.speed).not.toEqual(26);
});

test("Typing doesn't end with a break tag.", () => {
  jest.useFakeTimers();

  document.body.innerHTML = `<div>'
    <span id="element"></span>
  </div>`;

  const instance = new TypeIt("#element", {
    strings: ["One string.", "Two string", "Three string."]
  });

  jest.runAllTimers();

  expect(
    instance.instances[0].elementContainer.innerHTML.endsWith("<br>")
  ).not.toBe(true);
});
