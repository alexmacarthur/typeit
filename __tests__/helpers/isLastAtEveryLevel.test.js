import isLastAtEveryLevel, {
  hasCharacterAsNextSibling
} from "../../src/helpers/isLastAtEveryLevel";

describe("hasCharacterAsNextSibling()", () => {
  test("Returns false when there's no next sibling.", () => {
    setHTML`
      <span class="ti-container"><i id="node">a</i></span>
    `;

    let node = document.getElementById("node");
    let result = hasCharacterAsNextSibling(node);

    expect(result).toBe(false);
  });

  test("Returns true when there's a sibling character.", () => {
    setHTML`
      <span class="ti-container"><i id="node">a</i>b</span>
    `;

    let node = document.getElementById("node");
    let result = hasCharacterAsNextSibling(node);

    expect(result).toBe(true);
  });
});

test("Returns true when element is last.", () => {
  setHTML`
    <span class="ti-container">
      <i id="node"></i>
    </span>`;

  let node = document.getElementById("node");
  let result = isLastAtEveryLevel(node);

  expect(result).toBe(true);
});

test("Returns false when element is not last.", () => {
  setHTML`
    <span class="ti-container">
      <i id="node"></i>
      <i></i>
    </span>`;

  let node = document.getElementById("node");
  let result = isLastAtEveryLevel(node);

  expect(result).toBe(false);
});

test("Returns false when nested element is not always last.", () => {
  setHTML`
    <span class="ti-container">
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
    <span class="ti-container">
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
    <span class="ti-container">
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
    <span class="ti-container">
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
