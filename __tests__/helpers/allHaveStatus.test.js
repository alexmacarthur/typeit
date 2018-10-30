import allHaveStatus from "../../src/helpers/allHaveStatus";

test("Returns true when all things have certain status.", () => {
  let instances = [
    {
      status: {
        isComplete: true
      }
    },
    {
      status: {
        isComplete: true
      }
    },
    {
      status: {
        isComplete: true
      }
    }
  ];

  expect(allHaveStatus(instances, "isComplete", true)).toEqual(true);
});

test("Returns false when all but one have status.", () => {
  let instances = [
    {
      status: {
        isComplete: true
      }
    },
    {
      status: {
        isComplete: true
      }
    },
    {
      status: {
        isComplete: false
      }
    }
  ];

  expect(allHaveStatus(instances, "isComplete", true)).toEqual(false);
});

test("Returns false when all are false.", () => {
  let instances = [
    {
      status: {
        isComplete: false
      }
    },
    {
      status: {
        isComplete: false
      }
    },
    {
      status: {
        isComplete: false
      }
    }
  ];

  expect(allHaveStatus(instances, "isComplete", true)).toEqual(false);
});

test("Returns true when testing for falsy.", () => {
  let instances = [
    {
      status: {
        isComplete: false
      }
    },
    {
      status: {
        isComplete: false
      }
    },
    {
      status: {
        isComplete: false
      }
    }
  ];

  expect(allHaveStatus(instances, "isComplete", false)).toEqual(true);
});

test("Operates correctly when using different property.", () => {
  let instances = [
    {
      status: {
        isFrozen: true
      }
    },
    {
      status: {
        isFrozen: true
      }
    },
    {
      status: {
        isFrozen: true
      }
    }
  ];

  expect(allHaveStatus(instances, "isFrozen", true)).toEqual(true);
});

test("Gracefully returns false when reference nonexistent property.", () => {
  let instances = [
    {
      status: {
        isFrozen: true
      }
    },
    {
      status: {
        isFrozen: true
      }
    },
    {
      status: {
        isFrozen: true
      }
    }
  ];

  expect(allHaveStatus(instances, "nonExistentProperty", true)).toEqual(false);
});

test("Gracefully returns false when passing empty array.", () => {
  let instances = [];

  expect(allHaveStatus(instances, "someProperty", true)).toEqual(false);
});
