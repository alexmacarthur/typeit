import getTextWidth from "../../src/helpers/getTextWidth";

test("Calulates width.", () => {
  setHTML`
    <span id="element">|</span>
  `;

  let result = getTextWidth(document.getElementById("element"));
  expect(typeof result).toEqual("number");
});
