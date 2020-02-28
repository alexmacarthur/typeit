import removeComments from "../../src/helpers/removeComments";

test("It should remove comments from a simple string.", () => {
  setHTML`<span id="element">This is a string! <!-- a comment. --></span>`;
  let element = document.getElementById("element");
  let result = removeComments(element);
  expect(result).toEqual("This is a string!");
});

test("It should remove comments from simple HTML.", () => {
  setHTML`
    <span id="element">
      This is some <strong>very simple</strong> text! <!-- a comment. -->
    </span>`;
  let element = document.getElementById("element");
  let result = removeComments(element);
  expect(result).toEqual("This is some <strong>very simple</strong> text!");
});

test("It should remove comments from complex HTML.", () => {
  setHTML`
    <span id="element">
      This is some <br><strong>somewhat <em>complex</em></strong> text! <!-- a comment. -->
    </span>`;
  let element = document.getElementById("element");
  let result = removeComments(element);
  expect(result).toEqual(
    "This is some <br><strong>somewhat <em>complex</em></strong> text!"
  );
});

test("It should remove multiple comments when they exist.", () => {
  setHTML`<span id="element"><!-- a comment. -->This has <strong>lots<!-- a comment. --></strong> of comments! <!-- a comment. --></span>`;
  let element = document.getElementById("element");
  let result = removeComments(element);

  expect(result).toEqual("This has <strong>lots</strong> of comments!");
});
