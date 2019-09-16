import isLastAtEveryLevel, {
  hasCharacterAsNextSibling
} from "../../src/helpers/isLastAtEveryLevel";

describe("hasCharacterAsNextSibling()", () => {
  test("Returns false when there's no next sibling.", () => {
    document.body.innerHTML = `
    <span class="ti-container">
      <i class="ti-char" id="node">a</i>
    </span>
  `;

    let node = document.getElementById("node");
    let result = hasCharacterAsNextSibling(node);

    expect(result).toBe(false);
  });

  test("Returns true when there's a sibling character.", () => {
    document.body.innerHTML = `
      <span class="ti-container">
        <i class="ti-char" id="node">a</i>
        <i class="ti-char">b</i>
      </span>
    `;

    let node = document.getElementById("node");
    let result = hasCharacterAsNextSibling(node);

    expect(result).toBe(true);
  });

  test("Returns false when next sibling element lacks `.ti-char` class.", () => {
    document.body.innerHTML = `
      <span class="ti-container">
        <i class="ti-char" id="node">a</i>
        <i>b</i>
      </span>
    `;

    let node = document.getElementById("node");
    let result = hasCharacterAsNextSibling(node);

    expect(result).toBe(false);
  });

  test("Returns false when sibling is not element.", () => {
    document.body.innerHTML = `
      <span class="ti-container">
        <i class="ti-char" id="node">a</i>
        some text.
      </span>
    `;

    let node = document.getElementById("node");
    let result = hasCharacterAsNextSibling(node);

    expect(result).toBe(false);
  });
});

test("Returns true when element is last.", () => {
  document.body.innerHTML = `
    <span class="ti-container">
      <i class="ti-char" id="node"></i>
    </span>
  `;

  let node = document.getElementById("node");
  let result = isLastAtEveryLevel(node);

  expect(result).toBe(true);
});

test("Returns false when element is not last.", () => {
  document.body.innerHTML = `
    <span class="ti-container">
      <i class="ti-char" id="node"></i>
      <i class="ti-char"></i>
    </span>
  `;

  let node = document.getElementById("node");
  let result = isLastAtEveryLevel(node);

  expect(result).toBe(false);
});

test("Returns false when nested element is not always last.", () => {
  document.body.innerHTML = `
    <span class="ti-container">
      <i class="ti-char">
        <strong>
          <i class="ti-char" id="node">a</i>
        </strong>
      </i>
      <i class="ti-char"></i>
    </span>
  `;

  let node = document.getElementById("node");
  let result = isLastAtEveryLevel(node);

  expect(result).toBe(false);
});

test("Returns true when nested element is always last.", () => {
  document.body.innerHTML = `
    <span class="ti-container">
      <i class="ti-char"></i>
      <i class="ti-char">
        <strong>
          <i class="ti-char" id="node">a</i>
        </strong>
      </i>
    </span>
  `;

  let node = document.getElementById("node");
  let result = isLastAtEveryLevel(node);

  expect(result).toBe(true);
});

test("Returns true when nested element is an icon tag.", () => {
  document.body.innerHTML = `
    <span class="ti-container">
      <i class="ti-char"></i>
      <i class="ti-char">
        <i>
          <i class="ti-char" id="node">a</i>
        </i>
      </i>
    </span>
  `;

  let node = document.getElementById("node");
  let result = isLastAtEveryLevel(node);

  expect(result).toBe(true);
});

test("Returns true when deeply nested element is always last.", () => {
  document.body.innerHTML = `
    <span class="ti-container">
      <i class="ti-char"></i>
      <i class="ti-char">
        <strong>
          <i class="ti-char">a</i>
        </strong>
      </i>
      <i class="ti-char">
        <strong>
          <i class="ti-char">
            <span>
              <i class="ti-char" id="node">a</i>
            </span>
          </i>
        </strong>
      </i>
    </span>
  `;

  let node = document.getElementById("node");
  let result = isLastAtEveryLevel(node);

  expect(result).toBe(true);
});

test("Returns false when deeply nested element is not always last.", () => {
  document.body.innerHTML = `
    <span class="ti-container">
      <i class="ti-char"></i>
      <i class="ti-char">
        <strong>
          <i class="ti-char">
            <span>
              <i class="ti-char" id="node">a</i>
            </span>
          </i>
        </strong>
      </i>
      <i class="ti-char">
        <strong>
          <i class="ti-char">a</i>
        </strong>
      </i>
    </span>
  `;

  let node = document.getElementById("node");
  let result = isLastAtEveryLevel(node);

  expect(result).toBe(false);
});
