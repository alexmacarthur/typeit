beforeEach(() => {
  global.HTMLElement.prototype.animate = () => {
    return {};
  };
  global.HTMLElement.prototype.getAnimations = () => [
    {
      effect: {
        getComputedTiming: () => {
          return {};
        },
        getKeyframes: () => [],
      },
      cancel: () => {},
      currentTime: 0,
    },
  ];
});

global.setHTML = (html, shouldReturn = false) => {
  let domString = String.raw({ raw: html })
    .replace(/(\r\n|\n|\r)/gm, "")
    .replace(/>\s+</g, "><");

  if (shouldReturn) {
    return domString;
  }

  document.body.innerHTML = domString;
};

global.verifyQueue = ({ queue, totalItems, totalTypeableItems }) => {
  const queueItems = queue.getItems();
  const typeableItems = queueItems.filter((i) => i.typeable);

  expect(queueItems).toHaveLength(totalItems);
  expect(typeableItems).toHaveLength(totalTypeableItems);
};

jest.fn().constructor.prototype.times = function () {
  return this.mock.calls.length;
};

global.makeMocks = () => {
  const iterator = {
    next() {
      return {
        done: false,
        value: jest.fn(),
      };
    },

    [Symbol.iterator]() {
      return iterator;
    },
  };

  return iterator;
};
