import createCursorWrapper from "../../src/helpers/createCursorWrapper";

describe("cursor is at the beginning of a string", () => {
  it("does not do anything", () => {
    setHTML`<span class="ti-cursor">|</span>abc`;

    const cursor = document.querySelector(".ti-cursor");

    createCursorWrapper(cursor);

    expect(document.body.innerHTML).toEqual(
      '<span class="ti-cursor">|</span>abc'
    );
  });
});

describe("cursor is at the end of a string", () => {
  it("does not do anything", () => {
    setHTML`abc<span class="ti-cursor">|</span>`;

    const cursor = document.querySelector(".ti-cursor");

    createCursorWrapper(cursor);

    expect(document.body.innerHTML).toEqual(
      'abc<span class="ti-cursor">|</span>'
    );
  });
});

describe("cursor is in the middle of a string", () => {
  it("wraps the cursor and sibling character", () => {
    setHTML`a<span class="ti-cursor">|</span>bc`;

    const cursor = document.querySelector(".ti-cursor");

    createCursorWrapper(cursor);

    expect(document.body.innerHTML).toEqual(
      '<span class="ti-cursor-wrapper">a<span class="ti-cursor">|</span></span>bc'
    );
  });
});
