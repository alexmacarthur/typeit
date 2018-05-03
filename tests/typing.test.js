import TypeIt from "../src/typeit";

test("Generates a queue correctly.", () => {
  document.body.innerHTML = `<div>'
      <span id="element"></span>
    </div>`;

  const instance = new TypeIt("#element", {
    strings: ["Taxation is...", "theft."]
  });

  instance.instances.forEach(instance => {
    expect(instance.queue).toHaveLength(23);
  });
});

test("Generates a queue correctly when chaining upon instantiation.", () => {
  document.body.innerHTML = `<div>'
      <span id="element"></span>
    </div>`;

  const instance = new TypeIt("#element", {})
    .type("First string.")
    .delete()
    .type("Second string.");

  instance.instances.forEach(instance => {
    expect(instance.queue).toHaveLength(28);
  });
});

test("Pauses and resumes typing.", () => {
  jest.useFakeTimers();

  document.body.innerHTML = `<div>'
      <span id="element"></span>
    </div>`;

  const instance = new TypeIt("#element", {
    strings: "Chicken nuggets."
  });

  //-- Pause typing.
  instance.freeze();

  instance.instances.forEach(instance => {
    expect(instance.isFrozen).toBe(true);
  });

  //-- Resume typing.
  setTimeout(() => {
    instance.unfreeze();
  }, 1000);

  jest.runAllTimers();

  const typedString = document.querySelector("#element .ti-container")
    .innerHTML;

  expect(typedString).toEqual("Chicken nuggets.");
});

test("Instance is marked complete successfully.", () => {
  jest.useFakeTimers();

  document.body.innerHTML = `<div>'
      <span id="element"></span>
    </div>`;

  const instance = new TypeIt("#element", {
    strings: ["Ham over turkey.", "<strong>Obviously.</strong>"]
  });

  jest.runAllTimers();

  const typedString = document.querySelector("#element .ti-container")
    .innerHTML;

  //-- Typing should be complete with the correct string.
  expect(instance.isComplete).toBe(true);
  expect(typedString).toEqual(
    "Ham over turkey.<br><strong>Obviously.</strong>"
  );
});

test("Can type new string after completion.", () => {
  jest.useFakeTimers();

  document.body.innerHTML = `<div>'
      <span id="element"></span>
    </div>`;

  const instance = new TypeIt("#element", {
    strings: "Ham over turkey."
  });

  jest.runAllTimers();

  let typedString = document.querySelector("#element .ti-container").innerHTML;

  expect(typedString).toEqual("Ham over turkey.");

  instance.type(" Obviously.");

  jest.runAllTimers();

  typedString = document.querySelector("#element .ti-container").innerHTML;

  expect(typedString).toEqual("Ham over turkey. Obviously.");
});

test("Generates correct `nextStringDelay`.", () => {
  document.body.innerHTML = `<div>'
      <span id="element"></span>
    </div>`;

  const instance1 = new TypeIt("#element", {
    nextStringDelay: 500,
    strings: ["Free markets...", "win."]
  });

  let nextStringDelay = instance1.instances[0].options.nextStringDelay;

  expect(typeof nextStringDelay).toBe("object");
  expect(nextStringDelay.before).toBe(250);
  expect(nextStringDelay.after).toBe(250);
  expect(nextStringDelay.total).toBe(500);

  const instance2 = new TypeIt("#element", {
    nextStringDelay: [150, 400],
    strings: ["Free markets...", "win."]
  });

  nextStringDelay = instance2.instances[0].options.nextStringDelay;

  expect(nextStringDelay.before).toBe(150);
  expect(nextStringDelay.after).toBe(400);
  expect(nextStringDelay.total).toBe(550);
});

test("Generates correct `loopDelay`.", () => {
  document.body.innerHTML = `<div>'
      <span id="element"></span>
    </div>`;

  const instance1 = new TypeIt("#element", {
    nextStringDelay: 500,
    strings: ["Free markets...", "win."]
  });

  let nextStringDelay = instance1.instances[0].options.nextStringDelay;
  let loopDelay = instance1.instances[0].options.loopDelay;

  expect(loopDelay).toBe(false);

  const instance2 = new TypeIt("#element", {
    loopDelay: [3000, 5000],
    strings: ["Free markets...", "win."]
  });

  loopDelay = instance2.instances[0].options.loopDelay;

  expect(typeof loopDelay).toBe("object");
  expect(loopDelay.before).toBe(3000);
  expect(loopDelay.after).toBe(5000);
  expect(loopDelay.total).toBe(8000);
});

test("Wraps pauses correctly when replacing lines.", () => {
  document.body.innerHTML = `<div>'
      <span id="element"></span>
    </div>`;

  const instance = new TypeIt("#element", {
    strings: ["Free markets...", "win."],
    breakLines: false
  });

  const firstInstance = instance.instances[0];

  expect(firstInstance.queue[15][0].name).toBe("pause");
  expect(firstInstance.queue[15][1]).toBe(
    firstInstance.options.nextStringDelay.before
  );

  expect(firstInstance.queue[31][0].name).toBe("pause");
  expect(firstInstance.queue[31][1]).toBe(
    firstInstance.options.nextStringDelay.after
  );
});

test("Wraps pauses correctly when breaking lines.", () => {
  document.body.innerHTML = `<div>'
      <span id="element"></span>
    </div>`;

  const instance = new TypeIt("#element", {
    nextStringDelay: 500,
    strings: ["Free markets...", "win."]
  });

  const firstInstance = instance.instances[0];

  expect(firstInstance.queue[15][0].name).toBe("pause");
  expect(firstInstance.queue[15][1]).toBe(250);

  expect(firstInstance.queue[17][0].name).toBe("pause");
  expect(firstInstance.queue[17][1]).toBe(250);
});

test("Removes empty HTML when necessary.", () => {
  jest.useFakeTimers();

  document.body.innerHTML = `<div>'
      <span id="element"></span>
    </div>`;

  const instance = new TypeIt("#element", {
    breakLines: false
  })
    .type("This is a string with some <strong>bold.</strong>")
    .delete(5)
    .type("standard text.")
    .delete(14)
    .type("<em>italicized text...</em>")
    .delete(18)
    .type("standard text again.");

  jest.runAllTimers();

  let emptyTagPattern = /<[^\/>][^>]*><\/[^>]+>/;

  let result = document.getElementById("element").querySelector(".ti-container")
    .innerHTML;

  //-- Ensure our regex correctly finds empty tags.
  expect("Text with <strong></strong> a set of empty tags!").toMatch(
    emptyTagPattern
  );

  //-- Will not have any empty HTML.
  expect(result).not.toMatch(emptyTagPattern);
});
