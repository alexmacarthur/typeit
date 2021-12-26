import calculateStepsToSelector from "../../src/helpers/calculateStepsToSelector";
import expandTextNodes from "../../src/helpers/expandTextNodes";

describe("moving toward the beginning", () => {
  it("calculates correctly with basic HTML", () => {
    setHTML`<span id="el">abc<strong>def</strong>ghi<span class="ti-cursor">|</span></span>`;

    const el = document.getElementById("el");

    expandTextNodes(el);

    const result = calculateStepsToSelector("strong", el);

    expect(result).toEqual(6);
  });

  it("calculates correctly with nested HTML", () => {
    setHTML`<span id="el">abc<strong>def<em>ghi</em></strong>k<span class="ti-cursor">|</span></span>`;

    const el = document.getElementById("el");

    expandTextNodes(el);

    const result = calculateStepsToSelector("em", el);

    expect(result).toEqual(4);
  });

  it("moves to the beginning of the element when no selector is passed", () => {
    setHTML`<span id="el">12<strong>3</strong>45<span class="ti-cursor">|</span></span>`;

    const el = document.getElementById("el");

    expandTextNodes(el);

    const result = calculateStepsToSelector(null, el);

    expect(result).toEqual(5);
  });
});

describe("moving toward the end", () => {
  it("calculates correctly with basic HTML", () => {
    setHTML`<span id="el"><span class="ti-cursor">|</span>23<strong>456</strong>87</span>`;

    const el = document.getElementById("el");

    expandTextNodes(el);

    const result = calculateStepsToSelector("strong", el, "END");

    expect(result).toEqual(2);
  });

  it("calculates correctly with nested HTML", () => {
    setHTML`<span id="el">hello<span class="ti-cursor">|</span>23<strong>goodbye<em>ok, then!</em>haha.</strong>whatever.</span>`;

    const el = document.getElementById("el");

    expandTextNodes(el);

    const result = calculateStepsToSelector("em", el, "END");

    expect(result).toEqual(14);
  });

  it("calculates correctly when no selector is passed", () => {
    setHTML`<span id="el">hello.</span>`;

    const el = document.getElementById("el");

    expandTextNodes(el);

    const result = calculateStepsToSelector(null, el, "END");

    expect(result).toEqual(0);
  });
});
