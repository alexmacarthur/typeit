import guaranteeThreeKeys from "./helpers/guaranteeThreeKeys";
import merge from "./helpers/merge";

import { QueueItem } from "./types";

const Queue = function (initialItems: QueueItem[]) {
  const _setIdOnItems = (items: QueueItem[]): QueueItem[] => {
    return guaranteeThreeKeys(items).map((step) => {
      step[2] = merge(step[2], { id: _id });
      _id++;

      return step;
    });
  };

  /**
   * Insert items into the `waiting` queue.
   * @todo Can we part with this?
   */
  this.insert = function (start: number, newItems: any): void {
    _queue.splice(start, 0, newItems);
  };

  /**
   * Add a single or several steps onto the `waiting` queue.
   *
   * @param {array} stepOrSteps
   * @param {boolean} toBeginning
   * @return {object}
   */
  this.add = function (steps: QueueItem[], toBeginning = false) {
    // Set a unique ID onto each queue item added.
    // @todo maybe refactor this.. use a map?
    steps = _setIdOnItems(steps);

    _queue = toBeginning ? steps.concat(_queue) : _queue.concat(steps);

    return this;
  };

  /**
   * Given an index, set an item in the queue.
   *
   * @param {integer} index
   * @return {array}
   */
  this.set = function (index, item) {
    _queue[index] = item;
  };

  /**
   * Move all `executed` queue items to `waiting`.
   *
   * @return {object}
   */
  this.reset = function () {
    _queue = _queue.map((item) => {
      (item[2] as any).executed = false;
      return item;
    });
  };

  /**
   * Retrieve all items that are still eligible to be executed.
   *
   * @return {array}
   */
  this.getItems = function () {
    _queue = guaranteeThreeKeys(_queue);

    return _queue.filter((i) => {
      return !(i[2] as any).executed;
    });
  };

  /**
   * Given an ID for a particular queue item, update the meta on that item.
   *
   * @returns {void}
   */
  this.setMeta = function (id, meta) {
    let index = _queue.findIndex((i) => (i[2] as any).id === id);
    _queue[index][2] = merge(_queue[index][2], meta);
  };

  let _queue: QueueItem[] = [];
  let _id = 0;

  this.add(initialItems);
};

export default Queue;
