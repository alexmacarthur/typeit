import TypeIt from "../src/typeit";

test("beforeString() callback works.", () => {
  jest.useFakeTimers();

  document.body.innerHTML = `
    <div>
      <span id="element"></span>
    </div>
  `;

  let steps = [];

  const mockCallback = jest.fn();

  let instance = new TypeIt("#element", {
    strings: ["First.", "Second."],
    beforeString(step, queue, instance) {
      mockCallback(step, queue, instance);
    }
  });

  jest.runAllTimers();

  expect(mockCallback.mock.calls.length).toBe(2);

  expect(mockCallback.mock.calls[0][0][1]).toEqual("F");
  expect(mockCallback.mock.calls[0][0][2]).toEqual("first-of-string");
  expect(typeof mockCallback.mock.calls[0][2]).toEqual("object");

  expect(mockCallback.mock.calls[1][0][1]).toEqual("S");
  expect(mockCallback.mock.calls[1][0][2]).toEqual("first-of-string");
  expect(typeof mockCallback.mock.calls[1][2]).toEqual("object");
});

test("beforeStep() callback works.", () => {
  jest.useFakeTimers();

  document.body.innerHTML = `
    <div>
      <span id="element"></span>
    </div>
  `;

  let steps = [];

  const mockCallback = jest.fn();

  let instance = new TypeIt("#element", {
    strings: ["First.", "Second."],
    beforeStep(step, queue, instance) {
      mockCallback(step, queue, instance);
    }
  });

  jest.runAllTimers();

  expect(mockCallback.mock.calls.length).toBe(17);

  //-- Check the 3rd step.
  expect(mockCallback.mock.calls[2][0][1]).toEqual("i");
  expect(mockCallback.mock.calls[2][0][2]).toEqual(undefined);
  expect(typeof mockCallback.mock.calls[2][2]).toEqual("object");

  //-- Check the 7th step.
  expect(mockCallback.mock.calls[6][0][1]).toEqual(".");
  expect(mockCallback.mock.calls[6][0][2]).toEqual("last-of-string");
  expect(typeof mockCallback.mock.calls[6][2]).toEqual("object");
});

test("afterString() callback works.", () => {
  jest.useFakeTimers();

  document.body.innerHTML = `
    <div>
      <span id="element"></span>
    </div>
  `;

  let steps = [];

  const mockCallback = jest.fn();

  let instance = new TypeIt("#element", {
    strings: ["First.", "Second."],
    afterString(step, queue, instance) {
      mockCallback(step, queue, instance);
    }
  });

  jest.runAllTimers();

  expect(mockCallback.mock.calls.length).toBe(2);

  expect(mockCallback.mock.calls[0][0][1]).toEqual(".");
  expect(mockCallback.mock.calls[0][0][2]).toEqual("last-of-string");
  expect(typeof mockCallback.mock.calls[0][2]).toEqual("object");

  expect(mockCallback.mock.calls[1][0][1]).toEqual(".");
  expect(mockCallback.mock.calls[1][0][2]).toEqual("last-of-string");
  expect(typeof mockCallback.mock.calls[1][2]).toEqual("object");
});

test("afterStep() callback works.", () => {
  jest.useFakeTimers();

  document.body.innerHTML = `
    <div>
      <span id="element"></span>
    </div>
  `;

  let steps = [];

  const mockCallback = jest.fn();

  let instance = new TypeIt("#element", {
    strings: ["First.", "Second."],
    afterStep(step, queue, instance) {
      mockCallback(step, queue, instance);
    }
  });

  jest.runAllTimers();

  expect(mockCallback.mock.calls.length).toBe(17);

  //-- Check the 3rd step.
  expect(mockCallback.mock.calls[2][0][1]).toEqual("i");
  expect(mockCallback.mock.calls[2][0][2]).toEqual(undefined);
  expect(typeof mockCallback.mock.calls[2][2]).toEqual("object");

  //-- Check the 7th step.
  expect(mockCallback.mock.calls[6][0][1]).toEqual(".");
  expect(mockCallback.mock.calls[6][0][2]).toEqual("last-of-string");
  expect(typeof mockCallback.mock.calls[6][2]).toEqual("object");
});

test("afterComplete() callback works.", () => {
  jest.useFakeTimers();

  document.body.innerHTML = `
    <div>
      <span id="element"></span>
    </div>
  `;

  let steps = [];

  const mockCallback = jest.fn();

  let instance = new TypeIt("#element", {
    strings: ["First.", "Second."],
    afterComplete(instance) {
      mockCallback(instance);
    }
  });

  jest.runAllTimers();

  expect(mockCallback.mock.calls.length).toBe(1);
  expect(typeof mockCallback.mock.calls[0][0]).toBe("object");
});
