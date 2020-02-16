import repositionCursor from "../../src/helpers/repositionCursor";
import getAllTypeableNodes from "../../src/helpers/getAllTypeableNodes";

let element, cursor, allCharacters;

beforeEach(() => {
  setHTML`<span id="el"></span>`;

  element = document.querySelector("#el");

  // These need to be individual text nodes so that
  // `getAllTypeableNodes` can correctly collect individual nodes.
  [1, 2, 3, 4, 5, '<i id="cursor">|</i>'].forEach(thing => {
    element.insertAdjacentHTML("beforeend", thing);
  });

  cursor = document.querySelector("#cursor");
  allCharacters = getAllTypeableNodes(element, cursor, true);
});

test("Does not move cursor when stepsToMove is zero.", () => {
  repositionCursor(element, allCharacters, cursor, 0);

  expect(document.body.innerHTML).toMatchSnapshot();
});

test("Moves cursor three steps back.", () => {
  repositionCursor(element, allCharacters, cursor, 3);

  expect(document.body.innerHTML).toMatchSnapshot();
});

test("Moves cursor three back and two forward.", () => {
  repositionCursor(element, allCharacters, cursor, 3);

  repositionCursor(element, allCharacters, cursor, 1);

  expect(document.body.innerHTML).toMatchSnapshot();
});

test("Stops moving when at beginning of string.", () => {
  repositionCursor(element, allCharacters, cursor, 100);

  expect(document.body.innerHTML).toMatchSnapshot();
});

test("Stops moving when at end of string.", () => {
  repositionCursor(element, allCharacters, cursor, -100);

  expect(document.body.innerHTML).toMatchSnapshot();
});
