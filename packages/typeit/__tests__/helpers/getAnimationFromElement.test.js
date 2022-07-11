import getAnimationFromElement from "../../src/helpers/getAnimationFromElement";

describe("getAnimationFromElement()", () => {
  describe("element has animation id assigned", () => {
    it("returns animation by correct ID", () => {
      setHTML`<span id="cursor" data-ti-animation-id="3423"></span>`;

      const cursor = document.getElementById("cursor");
      cursor.getAnimations = () => {
        return [{ id: null }, { id: "3423" }];
      };

      const result = getAnimationFromElement(cursor);

      expect(result.id).toEqual("3423");
    });
  });

  describe("element does not have id assigned", () => {
    it("returns animation by correct ID", () => {
      setHTML`<span id="cursor"></span>`;

      const cursor = document.getElementById("cursor");
      cursor.getAnimations = () => {
        return [{ id: null }, { id: "3423" }];
      };

      const result = getAnimationFromElement(cursor);

      expect(result).toEqual(undefined);
    });
  });
});
