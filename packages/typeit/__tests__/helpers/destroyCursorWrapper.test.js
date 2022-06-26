import destroyCursorWrapper from "../../src/helpers/destroyCursorWrapper";
import * as chunkStrings from "../../src/helpers/chunkStrings";

describe("wrapper doesn't exist", () => {
  it("does not do anything", () => {
    const walkElementNodesSpy = jest.spyOn(chunkStrings, "walkElementNodes");
    setHTML`
            <span class="blah-blah-blah">
                a
                <span class="ti-cursor">|</span>
            </span>
        `;

    let cursor = document.querySelector(".ti-cursor");

    destroyCursorWrapper(cursor);

    expect(walkElementNodesSpy).not.toHaveBeenCalled();
  });
});

describe("wrapper does exist", () => {
  it("removes wrapper but keeps contents", () => {
    const walkElementNodesSpy = jest.spyOn(chunkStrings, "walkElementNodes");
    setHTML`
            <span id="element">
                <span class="ti-cursor-wrapper">
                    abc
                    <span class="ti-cursor">|</span>
                </span>
            </span>
        `;

    let cursor = document.querySelector(".ti-cursor");
    let element = document.getElementById("element");

    destroyCursorWrapper(cursor);

    expect(walkElementNodesSpy).toHaveBeenCalledTimes(1);

    expect(element.innerHTML.replace(/ /g, "")).toEqual(
      'abc<spanclass="ti-cursor">|</span>'
    );
  });
});
