beforeEach(() => {
  let animation = {
    pause: () => {},
    play: () => {},
    effect: {
      getComputedTiming: () => {
        return {};
      },
      getKeyframes: () => [],
    },
    cancel: () => {},
    currentTime: 0,
  };

  globalThis.HTMLElement.prototype.animate = () => animation;
  globalThis.HTMLElement.prototype.getAnimations = () => [animation];
  globalThis.requestAnimationFrame = (cb) => {
    cb();
  };
});

globalThis.setHTML = (html, shouldReturn = false) => {
  let domString = String.raw({ raw: html })
    .replace(/(\r\n|\n|\r)/gm, "")
    .replace(/>\s+</g, "><");

  if (shouldReturn) {
    return domString;
  }

  document.body.innerHTML = domString;
};

globalThis.verifyQueue = ({ queue, totalItems, totalTypeableItems }) => {
  const queueItems = queue.getItems();
  const typeableItems = queueItems.filter((i) => i.typeable);

  expect(queueItems).toHaveLength(totalItems);
  expect(typeableItems).toHaveLength(totalTypeableItems);
};

vi.fn().constructor.prototype.times = function () {
  return this.mock.calls.length;
};

globalThis.makeMocks = () => {
  const iterator = {
    next() {
      return {
        done: false,
        value: vi.fn(),
      };
    },

    [Symbol.iterator]() {
      return iterator;
    },
  };

  return iterator;
};
