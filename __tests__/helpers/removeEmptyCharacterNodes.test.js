import nodeCollectionToArray from "../../src/helpers/nodeCollectionToArray";
import removeEmptyCharacters, {
  characterIsEmpty,
  containsEmptyCharacter
} from "../../src/helpers/removeEmptyCharacters";

describe("characterIsEmpty()", () => {
  test("Returns false when a break tag is encountered.", () => {
    document.body.innerHTML = `<i class="ti-char"><br></i>`;
    let node = document.querySelector(".ti-char");
    let result = characterIsEmpty(node);
    expect(result).toBe(false);
  });

  test("Returns true when character is empty.", () => {
    document.body.innerHTML = `<i class="ti-char"></i>`;
    let node = document.querySelector(".ti-char");
    let result = characterIsEmpty(node);
    expect(result).toBe(true);
  });

  test("Returns false when character has text.", () => {
    document.body.innerHTML = `<i class="ti-char">hi.</i>`;
    let node = document.querySelector(".ti-char");
    let result = characterIsEmpty(node);
    expect(result).toBe(false);
  });

  test("Returns true when character has empty HTML", () => {
    document.body.innerHTML = `<i class="ti-char"><span></span></i>`;
    let node = document.querySelector(".ti-char");
    let result = characterIsEmpty(node);
    expect(result).toBe(true);
  });

  test("Returns false when character contains HTML containing other character (empty or not).", () => {
    document.body.innerHTML = `<i class="ti-char"><span><i class="ti-char"><a></a></i></span></i>`;
    let node = document.querySelector(".ti-char");
    let result = characterIsEmpty(node);
    expect(result).toBe(false);
  });
});

describe("containsEmptyCharacter()", () => {
  test("Returns true when at least one character is empty.", () => {
    document.body.innerHTML = `<i class="ti-char"></i><i class="ti-char">hi.</i>`;
    let nodes = nodeCollectionToArray(document.querySelectorAll(".ti-char"));
    let result = containsEmptyCharacter(nodes);
    expect(result).toBe(true);
  });

  test("Returns false when none are empty.", () => {
    document.body.innerHTML = `<i class="ti-char">sup.</i><i class="ti-char">hi.</i>`;
    let nodes = nodeCollectionToArray(document.querySelectorAll(".ti-char"));
    let result = containsEmptyCharacter(nodes);
    expect(result).toBe(false);
  });
});

describe("removeEmptyCharacters()", () => {
  test("Empty character should be removed from DOM.", () => {
    document.body.innerHTML = `
      <span id="scope">
        <i class="ti-char"></i>
        <i class="ti-char">a</i>
        <i class="ti-char">b</i>
        <i class="ti-char">c</i>
      </span>`;

    removeEmptyCharacters(document.getElementById("scope"), ".ti-char");
    expect(document.body.innerHTML).toMatchSnapshot();
  });

  test("Empty HTML character should be removed from DOM.", () => {
    document.body.innerHTML = `
      <span id="scope">
        <i class="ti-char">a</i>
        <i class="ti-char"><span></span></i>
        <i class="ti-char">b</i>
        <i class="ti-char">c</i>
      </span>`;

    removeEmptyCharacters(document.getElementById("scope"), ".ti-char");
    expect(document.body.innerHTML).toMatchSnapshot();
  });

  test("Nested empty HTML character should be removed from DOM.", () => {
    document.body.innerHTML = `
      <span id="scope">
        <i class="ti-char">a</i>
        <i class="ti-char">b</i>
        <i class="ti-char"><span><i class="ti-char"><a></a></i></span></i>
        <i class="ti-char">c</i>
      </span>`;

    removeEmptyCharacters(document.getElementById("scope"), ".ti-char");
    expect(document.body.innerHTML).toMatchSnapshot();
  });
});
