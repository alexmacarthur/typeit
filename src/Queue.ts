import guaranteeThreeKeys from "./helpers/guaranteeThreeKeys";
import merge from "./helpers/merge";

import { QueueItem } from "./types";

const Queue = function (initialItems: QueueItem[]) {
  /**
   * Add a single or several steps onto the `waiting` queue.
   */
  const add = function (steps: QueueItem[]): typeof Queue {
    _queue = _queue.concat(guaranteeThreeKeys(steps));

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
      (item[2] as any).executed = false;

      return item;
    });
  };

  /**
   * Retrieve all items that are still eligible to be executed.
   */
  const getItems = function (): QueueItem[] {
    return _queue.filter((i) => !(i[2] as any).executed);
  };

  /**
   * Given an ID for a particular queue item, update the meta on that item.
   */
  const setMeta = function (index: number, meta): void {
    _queue[index][2] = merge(_queue[index][2], meta);
  };

  let _queue: QueueItem[] = [];

  add(initialItems);

  return {
    add,
    set,
    reset,
    getItems,
    setMeta,
  };
};

export default Queue;
