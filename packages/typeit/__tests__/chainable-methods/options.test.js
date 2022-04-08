import TypeIt from "../../src";

describe(".options()", () => {
  beforeEach(() => {
    setHTML`<div>
      <span id="element"></span>
    </div>`;
  });

  it("Updates options on the fly.", () => {
    const instance = new TypeIt("#element", {
      strings: "abc",
      speed: 0,
    })
      .type("abc")
      .options({ speed: 100, html: false, lifeLike: false })
      .type("def");

    let typeableItems = instance.getQueue().getTypeable();
    let firstSixItems = typeableItems.slice(0, 6);
    let lastThreeItems = [...typeableItems].reverse().slice(0, 3);

    firstSixItems.forEach((i) => expect(i.delay).toEqual(0));
    lastThreeItems.forEach((i) => expect(i.delay).toEqual(100));
  });
});
