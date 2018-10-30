import toArrayOfNodes from "../../src/helpers/toArrayOfNodes";

test("Returns NodeList when selected elements are passed.", () => {
  document.body.innerHTML = `
        <button>A button</button>
        <button>A button</button>
    `;

  let result = toArrayOfNodes(document.querySelectorAll("button"));

  expect(result).toBeInstanceOf(Array);
});

test("Returns NodeList when single element is passed.", () => {
  document.body.innerHTML = `
        <button>A button</button>
    `;

  let result = toArrayOfNodes(document.querySelector("button"));

  expect(result).toBeInstanceOf(Array);
});

test("Returns NodeList when string is passed.", () => {
  document.body.innerHTML = `
        <button>A button</button>
    `;

  let result = toArrayOfNodes("button");

  expect(result).toBeInstanceOf(Array);
});
