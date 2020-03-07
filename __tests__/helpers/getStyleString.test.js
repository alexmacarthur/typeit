import getStyleString from "../../src/helpers/getStyleString";

test("Should not apply any styles if none are set.", () => {
  setHTML`
    <span id="element"></span>
  `;

  let mainEl = document.getElementById("element");
  let result = getStyleString(mainEl);

  expect(result).toEqual("");
});

test("Should apply whitelisted styles from main element to target element.", () => {
  setHTML`
    <span id="element" style="font-size: 3px; color: pink; line-height: normal;"></span>
  `;

  let mainEl = document.getElementById("element");
  let result = getStyleString(mainEl);

  expect(result).toEqual(
    "color: pink; font: normal 3px normal normal normal normal;"
  );
});

test("Should not apply blacklisted styles from main element to target element.", () => {
  setHTML`
    <span id="element" style="color: pink; margin: 25px;"></span>
  `;

  let mainEl = document.getElementById("element");
  let result = getStyleString(mainEl);

  expect(result).toEqual("color: pink;");
});
