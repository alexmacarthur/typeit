import nodeCollectionToArray from "../../src/helpers/nodeCollectionToArray";
import removeEmptyElements, {
  characterIsEmpty,
  containsEmptyCharacter
} from "../../src/helpers/removeEmptyElements";

describe("characterIsEmpty()", () => {
  test("Returns false when a break tag is encountered.", () => {
    let result = characterIsEmpty(document.createElement("BR"));
    expect(result).toBe(false);
  });

  test("Returns false when character has text.", () => {
    let node = document.createTextNode("hi.");
    let result = characterIsEmpty(node);
    expect(result).toBe(false);
  });

  test("Returns true when character has empty HTML", () => {
    setHTML`<span></span>`;
    let node = document.querySelector("span");
    let result = characterIsEmpty(node);
    expect(result).toBe(true);
  });

  test("Returns false when character contains HTML containing other character (empty or not).", () => {
    setHTML`<span><a></a></span>`;
    let node = document.querySelector("span");
    let result = characterIsEmpty(node);
    expect(result).toBe(false);
  });
});

describe("containsEmptyCharacter()", () => {
  test("Returns true when at least one character is empty.", () => {
    setHTML`<span>hi.<span></span>again.</span>`;
    let nodes = nodeCollectionToArray(
      document.querySelector("span").childNodes
    );
    let result = containsEmptyCharacter(nodes);
    expect(result).toBe(true);
  });

  test("Returns false when none are empty.", () => {
    setHTML`sup.hi.`;
    let nodes = nodeCollectionToArray(document.body.childNodes);
    let result = containsEmptyCharacter(nodes);
    expect(result).toBe(false);
  });
});

describe("removeEmptyElements()", () => {
  test("Empty HTML character should be removed from DOM.", () => {
    setHTML`<span id="scope">a<span></span>bc</span>`;
    removeEmptyElements(document.getElementById("scope"));
    expect(document.body.innerHTML).toMatchSnapshot();
  });

  test("Nested empty HTML character should be removed from DOM.", () => {
    setHTML`<span id="scope">ab<span><a></a></span>c</span>`;

    removeEmptyElements(document.getElementById("scope"));
    expect(document.body.innerHTML).toMatchSnapshot();
  });
});
