import asArray from "./helpers/asArray";
import { QueueItem } from "./types";

const Queue = function (initialItems: QueueItem[]) {
  /**
   * Add a single or several steps onto the `waiting` queue.
   */
  const add = function (steps: QueueItem[] | QueueItem): typeof Queue {
    _queue = _queue.concat(asArray<QueueItem>(steps));

    return this;
  };

  /**
   * Given an index, set an item in the queue.
   */
  const set = function (index: number, item: QueueItem): void {
    _queue[index] = item;
  };

  /**
   * Move all `executed` queue items to `waiting`.
   */
  const reset = function (): void {
    _queue = _queue.map((item) => {
      delete item.done;

      return item;
    });
  };

  /**
   * Retrieve all items that are still eligible to be executed.
   */
  const getItems = (): QueueItem[] => _queue.filter(i => !i.done);

  const markDone = (index: number) => {
    _queue[index].done = true;
  }

  let _queue: QueueItem[] = [];

  add(initialItems);

  return {
    add,
    set,
    reset,
    getItems,
    markDone,
  };
};

export default Queue;
