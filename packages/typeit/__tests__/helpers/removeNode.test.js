import removeNode from "../../src/helpers/removeNode";

it("removes a node", () => {
  setHTML`<div>hi.<span id="removeMe">bye.</span></div>`;

  removeNode(document.getElementById("removeMe"));

  expect(document.body.innerHTML).toEqual("<div>hi.</div>");
});

describe("parent removal", () => {
  it("removes parents if they will be empty", () => {
    setHTML`<div>hi.<h1><span id="removeMe">bye.</span></h1></div>`;

    removeNode(document.getElementById("removeMe"));

    expect(document.body.innerHTML).toEqual("<div>hi.</div>");
  });

  it("removes different parent if it will be empty", () => {
    setHTML`<span>abc<i>hi!</i></span>`;

    removeNode(document.body.querySelector("span").firstChild);

    expect(document.body.innerHTML).toEqual("<span><i>hi!</i></span>");
  });

  it("does not remove root element", () => {
    setHTML`<h3 id="root"><span><i>hi!</i></span></h3>`;

    const root = document.getElementById("root");
    removeNode(document.body.querySelector("span").firstChild, root);

    expect(document.body.innerHTML).toEqual('<h3 id="root"></h3>');
  });
});
