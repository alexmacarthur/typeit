import insertIntoElement from "../../src/helpers/insertIntoElement";
import getParsedBody from "../../src/helpers/getParsedBody";
import { walkElementNodes } from "../../src/helpers/chunkStrings";
import expandTextNodes from "../../src/helpers/expandTextNodes";

describe("an input", () => {
  it("inserts text into blank input", () => {
    setHTML`<input id="el">`;
    const el = document.getElementById("el");

    insertIntoElement(el, document.createTextNode("a"), null);

    expect(el.value).toEqual("a");
  });

  it("inserts text into filled input", () => {
    setHTML`<input id="el" value="ABC" />`;
    const el = document.getElementById("el");

    insertIntoElement(el, document.createTextNode("D"), null);

    expect(el.value).toEqual("ABCD");
  });
});

describe("plain text", () => {
  it("inserts a simple character", () => {
    setHTML`<span id="el"><i class="ti-cursor">|</i></span>`;
    const el = document.getElementById("el");

    insertIntoElement(el, document.createTextNode("x"));

    expect(document.body.innerHTML).toEqual(
      '<span id="el">x<i class="ti-cursor">|</i></span>'
    );
  });

  it("inserts nodes with parents set", () => {
    setHTML`<span id="el"><i class="ti-cursor">|</i></span>`;
    const el = document.body;

    const body = getParsedBody('<span id="el"><em>a</em></span>');
    const em = body.querySelector("em");
    em.originalParent = document.querySelector("#el");

    const text = em.firstChild;
    text.originalParent = em;

    insertIntoElement(el, em);
    expect(document.body.innerHTML).toEqual(
      '<span id="el"><em></em><i class="ti-cursor">|</i></span>'
    );

    insertIntoElement(el, text);
    expect(document.body.innerHTML).toEqual(
      '<span id="el"><em>a</em><i class="ti-cursor">|</i></span>'
    );
  });

  it("inserts blob of HTML", () => {
    setHTML`<span id="top"><i class="ti-cursor">|</i></span>`;
    const el = document.querySelector("#top");

    const spanEl = getParsedBody(
      'a<em id="middle">b<strong id="bottom">c</strong></em>'
    );
    const nodes = walkElementNodes(expandTextNodes(spanEl));

    nodes.forEach((n) => {
      insertIntoElement(el, n);
    });

    expect(document.body.innerHTML).toEqual(
      '<span id="top">a<em id="middle">b<strong id="bottom">c</strong></em><i class="ti-cursor">|</i></span>'
    );
  });

  it("inserts HTML with surprise <br />", () => {
    setHTML`<span id="top"><i class="ti-cursor">|</i></span>`;
    const el = document.querySelector("#top");

    const spanEl = getParsedBody("a<br/>b<br/>c</em>");
    const nodes = walkElementNodes(expandTextNodes(spanEl));

    spanEl.querySelectorAll("br").forEach((b) => {
      delete b.originalParent;
    });

    nodes.forEach((n) => {
      insertIntoElement(el, n);
    });

    expect(document.body.innerHTML).toEqual(
      '<span id="top">a<br>b<br>c<i class="ti-cursor">|</i></span>'
    );
  });
});
