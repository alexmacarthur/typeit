import isLastAtEveryLevel, {
  hasCharacterAsNextSibling
} from "../../src/helpers/isLastAtEveryLevel";

describe("hasCharacterAsNextSibling()", () => {
  test("Returns false when there's no next sibling.", () => {
    setHTML`
      <span data-typeit-id="whatever"><i id="node">a</i></span>
    `;

    let node = document.getElementById("node");
    let result = hasCharacterAsNextSibling(node);

    expect(result).toBe(false);
  });

  test("Returns true when there's a sibling character.", () => {
    setHTML`
      <span data-typeit-id="whatever"><i id="node">a</i>b</span>
    `;

    let node = document.getElementById("node");
    let result = hasCharacterAsNextSibling(node);

    expect(result).toBe(true);
  });
});

test("Returns true when element is last.", () => {
  setHTML`
    <span data-typeit-id="whatever">
      <i id="node"></i>
    </span>`;

  let node = document.getElementById("node");
  let result = isLastAtEveryLevel(node);

  expect(result).toBe(true);
});

test("Returns false when element is not last.", () => {
  setHTML`
    <span data-typeit-id="whatever">
      <i id="node"></i>
      <i></i>
    </span>`;

  let node = document.getElementById("node");
  let result = isLastAtEveryLevel(node);

  expect(result).toBe(false);
});

test("Returns false when nested element is not always last.", () => {
  setHTML`
    <span data-typeit-id="whatever">
      <i>
        <strong>
          <i id="node">a</i>
        </strong>
      </i>
      <i></i>
    </span>`;

  let node = document.getElementById("node");
  let result = isLastAtEveryLevel(node);

  expect(result).toBe(false);
});

test("Returns true when nested element is always last.", () => {
  setHTML`
    <span data-typeit-id="whatever">
      <i></i>
      <i>
        <strong>
          <i id="node">a</i>
        </strong>
      </i>
    </span>
  `;

  let node = document.getElementById("node");
  let result = isLastAtEveryLevel(node);

  expect(result).toBe(true);
});

test("Returns true when deeply nested element is always last.", () => {
  setHTML(`
    <span data-typeit-id="whatever">
      <i></i>
      <i>
        <strong>
          <i>a</i>
        </strong>
      </i>
      <i>
        <strong>
          <i>
            <span>
              <i id="node">a</i>
            </span>
          </i>
        </strong>
      </i>
    </span>
  `);

  let node = document.getElementById("node");
  let result = isLastAtEveryLevel(node);

  expect(result).toBe(true);
});

test("Returns false when deeply nested element is not always last.", () => {
  setHTML`
    <span data-typeit-id="whatever">
      <i></i>
      <i>
        <strong>
          <i>
            <span>
              <i id="node">a</i>
            </span>
          </i>
        </strong>
      </i>
      <i>
        <strong>
          <i>a</i>
        </strong>
      </i>
    </span>
  `;

  let node = document.getElementById("node");
  let result = isLastAtEveryLevel(node);

  expect(result).toBe(false);
});

test("Returns true when cursor exists and is ignored.", () => {
  setHTML`
    <span data-typeit-id="whatever">
      <span id="node">1</span>
      <span class="ti-cursor">|</span>
    </span>
  `;

  let node = document.getElementById("node");
  let nodeToIgnore = document.querySelector(".ti-cursor");
  let result = isLastAtEveryLevel(node, nodeToIgnore);

  expect(result).toBe(true);
});
