import setMetaProperty from "../../src/helpers/setMetaProperty";

describe("Queue items that do not have object already set.", () => {
  test("Sets property on item.", () => {
    let result = setMetaProperty(["action", null], { freezeCursor: true });
    expect(result).toEqual(["action", null, { freezeCursor: true }]);
  });
});

describe("Queue items that already have an object set.", () => {
  test("Sets property on item.", () => {
    let result = setMetaProperty(["action", null, { isFirst: true }], { freezeCursor: true });
    expect(result).toEqual(["action", null, { isFirst: true, freezeCursor: true }]);
  });
});
