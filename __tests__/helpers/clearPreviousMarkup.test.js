import clearPreviousMarkup from "../../src/helpers/clearPreviousMarkup";

test("Should remove .ti-* markup.", () => {
  setHTML`<h3 id="example1" data-typeitid="arbitrary-id">hello!<span class="ti-cursor">|</span></h3>`;

  clearPreviousMarkup(document.getElementById("example1"));

  expect(document.getElementById("example1").outerHTML).toMatchSnapshot();
});

test("Should leave other markup alone.", () => {
  setHTML`<h3 id="example1" data-typeitid="arbitrary-id">This should be left alone.</h3>`;

  clearPreviousMarkup(document.getElementById("example1"));

  expect(document.getElementById("example1").outerHTML).toMatchSnapshot();
});
