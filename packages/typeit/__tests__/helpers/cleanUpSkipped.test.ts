import { expect, it, vi } from "vitest";
import cleanUpSkipped from "../../src/helpers/cleanUpSkipped";
import { QueueMapPair } from "../../src/types";

it("should clean up skipped items", () => {
  const cleanUp = vi.fn();
  const queueItems = [
    [Symbol("1"), vi.fn()],
    [Symbol("2"), vi.fn()],
    [Symbol("3"), vi.fn()],
    [Symbol("4"), vi.fn()],
    [Symbol("5"), vi.fn()],
  ] as QueueMapPair[];

  cleanUpSkipped({
    index: 1,
    newIndex: 3,
    queueItems,
    cleanUp,
  });

  expect(cleanUp).toHaveBeenCalledTimes(2);
  expect(cleanUp).toHaveBeenCalledWith(queueItems[2][0]);
  expect(cleanUp).toHaveBeenCalledWith(queueItems[3][0]);
});

it("should clean up skipped items... again", () => {
  const cleanUp = vi.fn();
  const queueItems = [
    [Symbol("1"), vi.fn()],
    [Symbol("2"), vi.fn()],
    [Symbol("3"), vi.fn()],
    [Symbol("4"), vi.fn()],
    [Symbol("5"), vi.fn()],
  ] as QueueMapPair[];

  cleanUpSkipped({
    index: 0,
    newIndex: 4,
    queueItems,
    cleanUp,
  });

  expect(cleanUp).toHaveBeenCalledTimes(4);
  expect(cleanUp).toHaveBeenCalledWith(queueItems[1][0]);
  expect(cleanUp).toHaveBeenCalledWith(queueItems[2][0]);
  expect(cleanUp).toHaveBeenCalledWith(queueItems[3][0]);
  expect(cleanUp).toHaveBeenCalledWith(queueItems[4][0]);
});

it("should clean up skipped items... again", () => {
  const cleanUp = vi.fn();
  const queueItems = [
    [Symbol("1"), vi.fn()],
    [Symbol("2"), vi.fn()],
    [Symbol("3"), vi.fn()],
    [Symbol("4"), vi.fn()],
    [Symbol("5"), vi.fn()],
  ] as QueueMapPair[];

  cleanUpSkipped({
    index: 0,
    newIndex: 0,
    queueItems,
    cleanUp,
  });

  expect(cleanUp).toHaveBeenCalledTimes(0);
});

it("should clean up skipped items... again", () => {
  const cleanUp = vi.fn();
  const queueItems = [
    [Symbol("1"), vi.fn()],
    [Symbol("2"), vi.fn()],
    [Symbol("3"), vi.fn()],
    [Symbol("4"), vi.fn()],
    [Symbol("5"), vi.fn()],
  ] as QueueMapPair[];

  cleanUpSkipped({
    index: 4,
    newIndex: 4,
    queueItems,
    cleanUp,
  });

  expect(cleanUp).toHaveBeenCalledTimes(0);
});
