import asArray from "./helpers/asArray";
import { QueueItem } from "./types";

let Queue = function (initialItems: QueueItem[]) {
  /**
   * Add a single or several steps onto the `waiting` queue.
   */
  let add = function (steps: QueueItem[] | QueueItem): typeof Queue {
    _queue = _queue.concat(asArray<QueueItem>(steps));

    return this;
  };

  /**
   * Given an index, set an item in the queue.
   */
  let set = function (index: number, item: QueueItem): void {
    _queue[index] = item;
  };

  /**
   * Move all `executed` queue items to `waiting`.
   */
  let reset = function (): void {
    _queue = _queue.map((item) => {
      delete item.done;

      return item;
    });
  };

  let wipe = function (): void {
    _queue = [];
    add(initialItems); 
  }

  /**
   * Retrieve all items that are still eligible to be executed. By default, only the 
   * completed items will be retrieved. 
   */
  let getItems = (all: boolean = false): QueueItem[] => _queue.filter(i => all || !i.done);

  let markDone = (index: number) => {
    _queue[index].done = true;
  }

  let _queue: QueueItem[] = [];

  add(initialItems);

  return {
    add,
    set,
    reset,
    wipe,
    getItems,
    markDone,
  };
};

export default Queue;
