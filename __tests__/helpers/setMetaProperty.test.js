import setMetaProperty from "../../src/helpers/setMetaProperty";

test("Sets property on meta object of each item.", () => {
  let items = [
    ["action1", null, {}],
    ["action2", null, {}],
    ["action3", null, {}]
  ];

  let result = setMetaProperty(items, { freezeCursor: true });
  expect(result).toMatchSnapshot();
});

test("Sets property on meta object of each item even when meta doesn't yet exist.", () => {
  let items = [
    ["action1", null],
    ["action2", null, {}],
    ["action3", null]
  ];

  let result = setMetaProperty(items, { freezeCursor: true });
  expect(result).toMatchSnapshot();
});

test("Sets property on meta object of each item even when meta doesn't yet exist.", () => {
  let items = [
    ["action1", null],
    ["action2", null, {}],
    ["action3", null]
  ];

  let result = setMetaProperty(items, { freezeCursor: true });
  expect(result).toMatchSnapshot();
});

test("Sets property on meta object of single item.", () => {
  let result = setMetaProperty(["action", null], { freezeCursor: true });
  expect(result).toEqual(["action", null, { freezeCursor: true }]);
});
