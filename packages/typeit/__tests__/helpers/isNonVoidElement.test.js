import isNonVoidElement from "../../src/helpers/isNonVoidElement";

describe("void elements", () => {
  it("returns false for breaks", () => {
    setHTML`<br />`;

    const result = isNonVoidElement(document.body.firstChild);
    expect(result).toBe(false);
  });

  it("returns false for other things", () => {
    setHTML`<input />`;

    const result = isNonVoidElement(document.body.firstChild);
    expect(result).toBe(false);
  });
});

describe("non-void elements", () => {
  it("returns true for filled elements", () => {
    setHTML`<span>hi.</span>`;

    const result = isNonVoidElement(document.body.firstChild);
    expect(result).toBe(true);
  });

  it("returns false for empty elements", () => {
    setHTML`<div></div>`;

    const result = isNonVoidElement(document.body.firstChild);
    expect(result).toBe(true);
  });

  it("returns false for mis-typed non-void elements", () => {
    setHTML`<div />`;

    const result = isNonVoidElement(document.body.firstChild);
    expect(result).toBe(true);
  });
});
