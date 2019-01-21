import convertHTMLEntities from "../../src/helpers/convertHTMLEntities";

test("Should convert enties to respective characters.", () => {
  expect(convertHTMLEntities("Apples &amp; bananas.")).toBe(
    "Apples & bananas."
  );
});

test("Should leave special characters alone.", () => {
  expect(convertHTMLEntities("Oats & carrots.")).toBe("Oats & carrots.");
});

test("Should leave HTML alone.", () => {
  expect(convertHTMLEntities("<strong>This</strong> is &gt; that.")).toBe(
    "<strong>This</strong> is > that."
  );
});

test("Should leave plain, character-less strings alone.", () => {
  expect(convertHTMLEntities("Just a standard, old string.")).toBe(
    "Just a standard, old string."
  );
});
