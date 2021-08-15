import {
  cursorFontStyles,
  setCursorStyles,
} from "../../src/helpers/setCursorStyles";

it("sets styles", () => {
  setHTML`<span id="element"></span>
    <style>
      #element {
        font-family: "Source Sans Pro";
        font-size: 12px;
        font-weight: 400;
        font-style: normal;
        color: blue;
        line-height: 1;
      }
    </style>
  `;

  const element = document.getElementById("element");
  const id = "9";
  const options = {
    cursorSpeed: 300,
  };

  setCursorStyles(id, options, element);

  expect(document.head.querySelector('style[id="9"]')).not.toBeNull();

  // Blinking animation is being set.
  expect(document.head.innerHTML).toMatch(
    /@keyframes blink-(.+) { 0% {opacity: 0} 49% {opacity: 0} 50% {opacity: 1} }/
  );

  // Custom properties are being set.
  Object.entries(cursorFontStyles).forEach(([styleName]) => {
    expect(document.head.innerHTML).toMatch(
      new RegExp(`var\\(--ti-${styleName}, (.+)\\);`)
    );
  });
});
