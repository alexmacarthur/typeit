import clearPreviousMarkup from "../../src/helpers/clearPreviousMarkup";

test("Should remove .ti-wrapper markup.", () => {
  document.body.innerHTML = `
    <h3 id="example1" data-typeitid="arbitrary-id">
      <span class="ti-wrapper">
        <span class="ti-container">hello!</span>
        <span class="ti-cursor">|</span>
      </span>
    </h3>`;

  clearPreviousMarkup(document.getElementById("example1"));

  expect(true).toMatchSnapshot();
});

test("Should leave other markup alone.", () => {
  document.body.innerHTML = `
    <h3 id="example1" data-typeitid="arbitrary-id">
      This should be left alone.
    </h3>`;

  clearPreviousMarkup(document.getElementById("example1"));

  expect(true).toMatchSnapshot();
});
