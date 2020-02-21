import selectorToElement from "../../src/helpers/selectorToElement";

test("Returns NodeList when single element is passed.", () => {
  setHTML`<button>A button</button>`;

  let result = selectorToElement(document.querySelector("button"));

  expect(result.constructor.name).toEqual("HTMLButtonElement");
});

test("Returns NodeList when string is passed.", () => {
  setHTML`<button>A button</button>`;

  let result = selectorToElement("button");

  expect(result.constructor.name).toEqual("HTMLButtonElement");
});
