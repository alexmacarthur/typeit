import handleFunctionalArg from "../../src/helpers/handleFunctionalArg";

describe("parameter is not a function", () => {
  it("returns value", () => {
    const result = handleFunctionalArg("hello");

    expect(result).toEqual("hello");
  });
});

describe("parameter is a function", () => {
  it("returns value of executed function", () => {
    const result = handleFunctionalArg(() => "goodbye");

    expect(result).toEqual("goodbye");
  });
});
