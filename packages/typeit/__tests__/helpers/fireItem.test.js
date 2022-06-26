import * as beforePaint from "../../src/helpers/beforePaint";
import fireItem from "../../src/helpers/fireItem";
let cursor;

beforeEach(() => {
  setHTML`<span id="cursor">|</span>`;

  cursor = document.getElementById('cursor');
});

describe("all items have delays", () => {
  it.only("does not group any items for execution.", async () => {    
    const beforePaintSpy = jest
      .spyOn(beforePaint, "default")
      .mockImplementation((cb) => cb());

    const wait = jest.fn((cb) => cb());
    const [mock1, mock2] = makeMocks();
    const queueItems = [
      [
        Symbol(),
        {
          func: mock1,
          delay: 1,
        },
      ],
      [
        Symbol(),
        {
          func: mock2,
          delay: 1,
        },
      ],
    ];

    const index = 0;
    const resultIndex = await fireItem({
      index,
      queueItems,
      wait,
      cursor,
    });

    expect(beforePaintSpy).toHaveBeenCalledTimes(1);
    expect(mock1).toHaveBeenCalledTimes(1);
    expect(mock2).not.toHaveBeenCalled();

    // Index was not modified.
    expect(resultIndex).toBe(index);
    expect(wait).toHaveBeenCalledTimes(1);
  });
});

describe("some items have no delay", () => {
  it("groups items for execution.", async () => {
    const [mock1, mock2, mock3, mock4] = makeMocks();
    const wait = jest.fn();
    const queueItems = [
      [
        Symbol(),
        {
          func: mock1,
          delay: 0,
        },
      ],
      [
        Symbol(),
        {
          func: mock2,
          delay: 0,
        },
      ],
      [
        Symbol(),
        {
          func: mock3,
          delay: 0,
        },
      ],
      [
        Symbol(),
        {
          func: mock4,
          delay: 1,
        },
      ],
    ];

    const index = 0;
    const resultIndex = await fireItem(index, queueItems, wait);

    [mock1, mock2, mock3].forEach((m) => {
      expect(m).toHaveBeenCalledTimes(1);
    });

    expect(mock4).not.toHaveBeenCalled();

    // Index was advanced.
    expect(resultIndex).toBe(2);
    expect(wait).not.toHaveBeenCalled();
  });
});
