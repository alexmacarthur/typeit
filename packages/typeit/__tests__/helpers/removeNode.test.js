import removeNode from "../../src/helpers/removeNode";

it("removes a node", () => {
  setHTML`<div>hi.<span id="removeMe">bye.</span></div>`;

  removeNode(document.getElementById("removeMe"));

  expect(document.body.innerHTML).toEqual("<div>hi.</div>");
});

it("removes parents if they will be empty", () => {
  setHTML`<div>hi.<h1><span id="removeMe">bye.</span></h1></div>`;

  removeNode(document.getElementById("removeMe"));

  expect(document.body.innerHTML).toEqual("<div>hi.</div>");
});

it("removes parents if they will be empty", () => {
  setHTML`<span>abc<i>hi!</i></span>`;

  removeNode(document.body.querySelector("span").firstChild);

  expect(document.body.innerHTML).toEqual("<span><i>hi!</i></span>");
});
