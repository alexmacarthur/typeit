import repositionCursor from "../../src/helpers/repositionCursor";
import { walkElementNodes } from "../../src/helpers/chunkStrings";
import expandTextNodes from "../../src/helpers/expandTextNodes";
import { defaultExpandTextNodes, emojiFiveDigitString } from "./util";
import GraphemeSplitter from "grapheme-splitter";

let element, allCharacters;

describe("cursor movement default charset", () => {
  beforeEach(() => {
    setHTML`<span id="el">12345<i class="ti-cursor">|</i></span>`;

    element = defaultExpandTextNodes(document.querySelector("#el"));

    allCharacters = walkElementNodes(element, true);
  });

  it("Does not move cursor when stepsToMove is zero.", () => {
    repositionCursor(element, allCharacters, 0);

    let expected = `<span id="el">12345<i class="ti-cursor">|</i></span>`;
    expect(document.body.innerHTML).toEqual(expected);
  });

  it("Moves cursor three steps back.", () => {
    repositionCursor(element, allCharacters, 3);

    let expected = `<span id="el">12<i class="ti-cursor">|</i>345</span>`;

    expect(document.body.innerHTML).toEqual(expected);
  });

  it("Moves cursor three back and two forward.", () => {
    repositionCursor(element, allCharacters, 3);

    repositionCursor(element, allCharacters, 1);

    let expected = `<span id="el">1234<i class="ti-cursor">|</i>5</span>`;
    expect(document.body.innerHTML).toEqual(expected);
  });

  it("Stops moving when at end of string.", () => {
    repositionCursor(element, allCharacters, -100);

    let expected = `<span id="el">12345<i class="ti-cursor">|</i></span>`;
    expect(document.body.innerHTML).toEqual(expected);
  });
});

describe("cursor movement emoji", () => {
  beforeEach(() => {
    // Set the HTML raw to avoid pre-processing of the emoji.
    document.body.innerHTML = `<span id="el">${emojiFiveDigitString}<i class="ti-cursor">|</i></span>`;
    const splitter = new GraphemeSplitter();
    element = expandTextNodes(document.querySelector("#el"), (str) =>
      splitter.splitGraphemes(str)
    );

    allCharacters = walkElementNodes(element, true);
  });
  it("Does not move cursor when stepsToMove is zero.", () => {
    repositionCursor(element, allCharacters, 0);

    let expected = `<span id="el">1️⃣2️⃣3️⃣4️⃣5️⃣<i class="ti-cursor">|</i></span>`;
    expect(document.body.innerHTML).toEqual(expected);
  });

  it("Moves cursor three steps back.", () => {
    repositionCursor(element, allCharacters, 3);

    let expected = `<span id="el">1️⃣2️⃣<i class="ti-cursor">|</i>3️⃣4️⃣5️⃣</span>`;

    expect(document.body.innerHTML).toEqual(expected);
  });

  it("Moves cursor three back and two forward.", () => {
    repositionCursor(element, allCharacters, 3);

    repositionCursor(element, allCharacters, 1);

    let expected = `<span id="el">1️⃣2️⃣3️⃣4️⃣<i class="ti-cursor">|</i>5️⃣</span>`;
    expect(document.body.innerHTML).toEqual(expected);
  });

  it("Stops moving when at end of string.", () => {
    repositionCursor(element, allCharacters, -100);

    let expected = `<span id="el">${emojiFiveDigitString}<i class="ti-cursor">|</i></span>`;
    expect(document.body.innerHTML).toEqual(expected);
  });
});
