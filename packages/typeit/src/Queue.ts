import asArray from "./helpers/asArray";
import { QueueItem } from "./types";

let Queue = function (initialItems: QueueItem[]) {
  /**
   * Add a single or several steps onto the `waiting` queue.
   */
  let add = function (steps: QueueItem[] | QueueItem): typeof Queue {
    asArray<QueueItem>(steps).forEach((step) => {
      return _q.set(Symbol(step.char?.innerText), buildQueueItem({ ...step }));
    });

    return this;
  };

  let getTypeable = (): QueueItem[] =>
    rawValues().filter((value) => value.typeable);

  /**
   * Given an index, set an item in the queue.
   */
  let set = function (index: number, item: QueueItem): void {
    let keys = [..._q.keys()];

    _q.set(keys[index], buildQueueItem(item));
  };

  let buildQueueItem = (queueItem: QueueItem): QueueItem => {
    queueItem.shouldPauseCursor = function () {
      return Boolean(this.typeable || this.cursorable || this.deletable);
    };

    return queueItem;
  };

  /**
   * Move all `executed` queue items to `waiting`.
   */
  let reset = function (): void {
    _q.forEach((item) => delete item.done);
  };

  let wipe = function (): void {
    _q = new Map();
    add(initialItems);
  };

  let getQueue = () => _q;
  let rawValues = (): QueueItem[] => Array.from(_q.values());
  let destroy = (key: Symbol) => _q.delete(key);

  /**
   * Retrieve all items that are still eligible to be executed. By default, only the
   * completed items will be retrieved.
   */
  let getItems = (all: boolean = false): QueueItem[] =>
    all ? rawValues() : rawValues().filter((i) => !i.done);

  let done = (key: Symbol, shouldDestroy: boolean = false) =>
    shouldDestroy ? _q.delete(key) : (_q.get(key).done = true);

  let _q = new Map();

  add(initialItems);

  return {
    add,
    set,
    wipe,
    reset,
    destroy,
    done,
    getItems,
    getQueue,
    getTypeable,
  };
};

export default Queue;
