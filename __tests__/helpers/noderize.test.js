import noderize, {
  placeholderize,
  removePlaceholderRemnants
} from "../../src/helpers/noderize";

test("Parses normal string correctly.", () => {
  let result = noderize("Hello, this is my string.");

  expect(result).toMatchSnapshot();
});

test("Parses single HTML tag.", () => {
  let result = noderize("Hello, this is some <strong>bold</strong> text.");

  expect(result).toMatchSnapshot();
});

test("Parses multiple HTML tags.", () => {
  let result = noderize(
    "Hello, this is some <strong>bold</strong> text, and some <i>italicized</i> text."
  );

  expect(result).toMatchSnapshot();
});

test("Parses HTML tag at beginning of string.", () => {
  let result = noderize(
    "<strong>Hello!</strong> This is some text with HTML at the beginning."
  );

  expect(result).toMatchSnapshot();
});

test("Parses HTML tag at end of string.", () => {
  let result = noderize(
    "This is some text with HTML at the <em>beginning.</em>"
  );

  expect(result).toMatchSnapshot();
});

test("Parses HTML tag with attributes.", () => {
  let result = noderize(
    'This string has an <strong class="strong-class" id="strong-id" data-whatever="data-att">element</strong> with attributes.'
  );

  expect(result).toMatchSnapshot();
});

describe("placeholderize()", () => {
  test("Sets placeholder for single regular HTML tag.", () => {
    let result = placeholderize(
      "This is a string with some <strong>bold text</strong>."
    );

    expect(result).toMatchSnapshot();
  });

  test("Sets placeholder for a self-closing tag.", () => {
    let result = placeholderize("This is a string with a <br/> break in it.");

    expect(result).toMatchSnapshot();
  });

  test("Sets placeholder for a self-closing tag with no closing slash.", () => {
    let result = placeholderize("This is a string with a <br> break in it.");

    expect(result).toMatchSnapshot();
  });

  test("Sets placeholder for strings with both standard tags and self-closing.", () => {
    let result = placeholderize(
      "This is a string with a <br> break in it, as well as some <em>italized</em> text."
    );

    expect(result).toMatchSnapshot();
  });

  test("Removes empty tags.", () => {
    let result = placeholderize("<span></span>");

    expect(result).toMatchSnapshot();
  });

  test("Removes empty tags with text surrounding them.", () => {
    let result = placeholderize("text! <span></span> text!");

    expect(result).toMatchSnapshot();
  });

  test("Removes empty tags that live with filled tags.", () => {
    let result = placeholderize("<span></span> <em>italics!</em>");

    expect(result).toMatchSnapshot();
  });
});

describe("removePlaceholderRemnants()", () => {
  test("It removes placeholder remnants following the end of a tag.", () => {
    let payload = [
      "x",
      {
        isLastCharacter: false
      },
      {
        isLastCharacter: false
      },
      {
        isLastCharacter: true
      },
      "%",
      "}"
    ];

    expect(removePlaceholderRemnants(payload)).toMatchSnapshot();
  });

  test("It does not touch array if last character is not followed by remnants.", () => {
    let payload = [
      "x",
      {
        isLastCharacter: false
      },
      {
        isLastCharacter: false
      },
      {
        isLastCharacter: true
      },
      "%",
      "%"
    ];

    expect(removePlaceholderRemnants(payload)).toMatchSnapshot();
  });

  test("It properly handles arrays whose node objects are at the very beginning.", () => {
    let payload = [
      {
        isLastCharacter: false
      },
      {
        isLastCharacter: false
      },
      {
        isLastCharacter: true
      },
      "%",
      "%"
    ];

    expect(removePlaceholderRemnants(payload)).toMatchSnapshot();
  });

  test("It properly handles arrays completely filled with node objects.", () => {
    let payload = [
      {
        isLastCharacter: false
      },
      {
        isLastCharacter: false
      },
      {
        isLastCharacter: true
      }
    ];

    expect(removePlaceholderRemnants(payload)).toMatchSnapshot();
  });

  test("It does not modify arrays with no node objects.", () => {
    let payload = ["a", "b", "c"];

    expect(removePlaceholderRemnants(payload)).toEqual(["a", "b", "c"]);
  });

  test("It does not modify arrays with no node objects.", () => {
    let payload = [
      "a",
      {
        tag: "BR",
        attributes: [],
        content: null
      },
      "%",
      "}"
    ];

    expect(removePlaceholderRemnants(payload)).toEqual([
      "a",
      { tag: "BR", attributes: [], content: null }
    ]);
  });
});
