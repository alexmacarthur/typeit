import getAllChars from "../../src/helpers/getAllChars";
import expandTextNodes from "../../src/helpers/expandTextNodes";

describe("element is an input", () => {
  setHTML`
        <input id="el" type="text" value="hello!" />
    `;

  test("it should return the input contents", () => {
    const result = getAllChars(document.getElementById("el"));

    expect(result).toEqual(["h", "e", "l", "l", "o", "!"]);
  });
});

describe("element is not an element", () => {
  test("it should return simple contents correctly", () => {
    setHTML`
            <span id="el">howdy.</span>
        `;

    expandTextNodes(document.getElementById("el"));

    const result = getAllChars(document.getElementById("el"));

    expect(result.map((n) => n.nodeValue)).toEqual([
      ".",
      "y",
      "d",
      "w",
      "o",
      "h",
    ]);
  });

  test("it should ignore cursor", () => {
    setHTML`
            <span id="el">greet<i class="ti-cursor">|</i>ings!</span>
        `;

    expandTextNodes(document.getElementById("el"));

    const result = getAllChars(document.getElementById("el"));

    expect(result.map((n) => n.nodeValue)).toEqual([
      "!",
      "s",
      "g",
      "n",
      "i",
      "t",
      "e",
      "e",
      "r",
      "g",
    ]);
  });
});
