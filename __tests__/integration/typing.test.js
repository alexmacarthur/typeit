import TypeIt from "../../src/TypeIt";

test("Generates a queue correctly.", () => {
  setHTML`<div>'
      <span id="element"></span>
    </div>`;

  const instance = new TypeIt("#element", {
    strings: ["Taxation is...", "theft."]
  }).go();

  expect(instance.getQueue().getItems()).toMatchSnapshot();
});

test("Generates a queue correctly when chaining upon instantiation.", () => {
  setHTML`<div>'
      <span id="element"></span>
    </div>`;

  const instance = new TypeIt("#element", {})
    .type("First string.")
    .delete()
    .type("Second string.")
    .go();

  expect(instance.getQueue().getItems()).toHaveLength(35);
});

test("Generates correct `nextStringDelay`.", () => {
  setHTML`<div>'
      <span id="element"></span>
    </div>`;

  const instance1 = new TypeIt("#element", {
    nextStringDelay: 500,
    strings: ["Free markets...", "win."]
  }).go();

  let nextStringDelay = instance1.getOptions().nextStringDelay;

  expect(typeof nextStringDelay).toBe("object");
  expect(nextStringDelay.before).toBe(250);
  expect(nextStringDelay.after).toBe(250);
  expect(nextStringDelay.total).toBe(500);

  const instance2 = new TypeIt("#element", {
    nextStringDelay: [150, 400],
    strings: ["Free markets...", "win."]
  }).go();

  nextStringDelay = instance2.getOptions().nextStringDelay;

  expect(nextStringDelay.before).toBe(150);
  expect(nextStringDelay.after).toBe(400);
  expect(nextStringDelay.total).toBe(550);
});

test("Generates correct `loopDelay`.", () => {
  setHTML`<div>'
      <span id="element"></span>
    </div>`;

  const instance1 = new TypeIt("#element", {
    nextStringDelay: 500,
    strings: ["Free markets...", "win."]
  }).go();

  let loopDelay = instance1.getOptions().loopDelay;

  expect(loopDelay.before).toBe(375);
  expect(loopDelay.after).toBe(375);
  expect(loopDelay.total).toBe(750);

  const instance2 = new TypeIt("#element", {
    loopDelay: [3000, 5000],
    strings: ["Free markets...", "win."]
  }).go();

  loopDelay = instance2.getOptions().loopDelay;

  expect(typeof loopDelay).toBe("object");
  expect(loopDelay.before).toBe(3000);
  expect(loopDelay.after).toBe(5000);
  expect(loopDelay.total).toBe(8000);
});

test("Removes empty HTML when necessary.", () => {
  setHTML`<div>'
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
    .type("standard text again.")
    .go();

  let emptyTagPattern = /<[^\/>][^>]*><\/[^>]+>/;

  let result = document.getElementById("element").innerHTML;

  //-- Ensure our regex correctly finds empty tags.
  expect("Text with <strong></strong> a set of empty tags!").toMatch(
    emptyTagPattern
  );

  //-- Will not have any empty HTML.
  expect(result).not.toMatch(emptyTagPattern);
});
