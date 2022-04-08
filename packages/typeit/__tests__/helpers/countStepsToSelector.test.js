import countStepsToSelector from "../../src/helpers/countStepsToSelector";
import { chunkStringAsHtml } from "../../src/helpers/chunkStrings";
import Queue from "../../src/Queue";

let buildQueueFromString = (str) => {
  let chunks = chunkStringAsHtml(str);
  let queue = new Queue([]);

  chunks.forEach((char) => {
    queue.add({
      char,
      typeable: true,
    });
  });

  return queue;
};

describe("moving toward the beginning", () => {
  it("calculates correctly with basic HTML", () => {
    let queue = buildQueueFromString(`abc<strong>def</strong>ghi`);

    const result = countStepsToSelector({
      queueItems: queue.getTypeable(),
      selector: "strong",
      cursorPosition: 0,
    });

    expect(result).toEqual(6);
  });

  it("calculates correctly with nested HTML", () => {
    let queue = buildQueueFromString(`abc<strong>def<em>ghi</em></strong>k`);

    const result = countStepsToSelector({
      queueItems: queue.getTypeable(),
      selector: "em",
      cursorPosition: 0,
    });

    expect(result).toEqual(4);
  });

  it("moves to the beginning of the element when no selector is passed", () => {
    let queue = buildQueueFromString(`12<strong>3</strong>45`);

    const result = countStepsToSelector({
      queueItems: queue.getTypeable(),
      selector: null,
      cursorPosition: 0,
    });

    expect(result).toEqual(6);
  });
});

describe("moving toward the end", () => {
  it("calculates correctly with basic HTML", () => {
    let queue = buildQueueFromString(`23<strong>456</strong>87`);

    const result = countStepsToSelector({
      queueItems: queue.getTypeable(),
      selector: "strong",
      cursorPosition: 0,
      to: "end",
    });

    expect(result).toEqual(2);
  });

  it("calculates correctly with nested HTML", () => {
    let queue = buildQueueFromString(
      `23<strong>goodbye<em>ok, then!</em>haha.</strong>whatever.`
    );

    const result = countStepsToSelector({
      queueItems: queue.getTypeable(),
      selector: "em",
      cursorPosition: 0,
      to: "end",
    });

    expect(result).toEqual(14);
  });

  it("stays at end when no selector is passed and moving to END", () => {
    let queue = buildQueueFromString(`hello.`);

    const result = countStepsToSelector({
      queueItems: queue.getTypeable(),
      selector: null,
      cursorPosition: 0,
      to: "end",
    });

    expect(result).toEqual(0);
  });
});
