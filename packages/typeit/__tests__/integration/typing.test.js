import TypeIt from "../../src/TypeIt";
import { expect } from "@jest/globals";

test("Generates a queue correctly.", () => {
  setHTML`<div>'
      <span id="element"></span>
    </div>`;

  const instance = new TypeIt("#element", {
    strings: ["Taxation is...", "theft."],
  });

  expect(instance.getQueue().getItems()).toMatchSnapshot();
});

test("Generates a queue correctly when chaining upon instantiation.", () => {
  setHTML`<div>
      <span id="element"></span>
    </div>`;

  const instance = new TypeIt("#element", {})
    .type("First string.")
    .delete()
    .type("Second string.");

  expect(instance.getQueue().getItems()).toHaveLength(10);
});

test("Removes empty HTML when necessary.", (done) => {
  setHTML`<div>'
      <span id="element"></span>
    </div>`;

  new TypeIt("#element", {
    speed: 0,
    breakLines: false,
    afterComplete: function () {
      let emptyTagPattern = /<[^\/>][^>]*><\/[^>]+>/;
      let result = document.getElementById("element").innerHTML;

      //-- Will not have any empty HTML.
      expect(result).not.toMatch(emptyTagPattern);

      done();
    },
  })
    .type("This is a string with some <strong>bold.</strong>")
    .delete(5)
    .type("standard text.")
    .delete(14)
    .type("<em>italicized text...</em>")
    .delete(18)
    .type("standard text again.")
    .go();
});
