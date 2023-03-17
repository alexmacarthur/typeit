import getAllChars from "../../src/helpers/getAllChars";
import expandTextNodes from "../../src/helpers/expandTextNodes";
import GraphemeSplitter from "grapheme-splitter";
import { defaultExpandTextNodes, defaultGetAllChars } from "./util";

describe("element is an input", () => {
  test("it should return the input contents", () => {
    setHTML`
        <input id="el" type="text" value="hello!" />
    `;

    const result = defaultGetAllChars(document.getElementById("el"));

    expect(result).toEqual(["h", "e", "l", "l", "o", "!"]);
  });
  test("it should return the input contents when containing emoji", () => {
    setHTML`
        <input id="el" type="text" value="⬆️ m̅" />
    `;
    const splitter = new GraphemeSplitter();
    const result = getAllChars(document.getElementById("el"), (str) =>
      splitter.splitGraphemes(str)
    );

    expect(result).toEqual(["⬆️", " ", "m̅"]);
  });
});

describe("element is not an element", () => {
  test("it should return simple contents correctly", () => {
    setHTML`
            <span id="el">howdy.</span>
        `;

    defaultExpandTextNodes(document.getElementById("el"));

    const result = defaultGetAllChars(document.getElementById("el"));

    expect(result.map((n) => n.nodeValue)).toEqual([
      ".",
      "y",
      "d",
      "w",
      "o",
      "h",
    ]);
  });

  test("it should return simple contents correctly when emoji are present", () => {
    setHTML`
            <span id="el">👍 howdy 🤯 🌷 Ĺo͂řȩm̅</span>
        `;
    const splitter = new GraphemeSplitter();

    expandTextNodes(document.getElementById("el"), (str) =>
      splitter.splitGraphemes(str)
    );

    const result = getAllChars(document.getElementById("el"), (str) =>
      splitter.splitGraphemes(str)
    );

    expect(result.map((n) => n.nodeValue)).toEqual([
      "m̅",
      "ȩ",
      "ř",
      "o͂",
      "Ĺ",
      " ",
      "🌷",
      " ",
      "🤯",
      " ",
      "y",
      "d",
      "w",
      "o",
      "h",
      " ",
      "👍",
    ]);
  });

  test("it should ignore cursor", () => {
    setHTML`
            <span id="el">greet<i class="ti-cursor">|</i>ings!</span>
        `;

    defaultExpandTextNodes(document.getElementById("el"));

    const result = defaultGetAllChars(document.getElementById("el"));

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
