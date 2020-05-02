import guaranteeThreeKeys from "./helpers/guaranteeThreeKeys";
import queueMany from "./helpers/queueMany";
import isArray from "./helpers/isArray";
import merge from "./helpers/merge";

export default function Queue(initialItem) {
  const _setIdOnItems = items => {
    return guaranteeThreeKeys(items).map(step => {
      step[2] = merge(step[2], { id: _id });
      _id++;
      return step;
    });
  };

  /**
   * Insert items into the `waiting` queue.
   * @todo Can we part with this?
   *
   * @param {integer} start
   * @param {array} newItems
   */
  this.insert = function(start, newItems) {
    _queue.splice(start, 0, newItems);
  };

  /**
   * Add a single or several steps onto the `waiting` queue.
   *
   * @param {array} stepOrSteps
   * @param {boolean} toBeginning
   * @return {object}
   */
  this.add = function(stepOrSteps, numberOfTimes, toBeginning) {
    // If a single thing is passed, assume it's an action with no argument.
    stepOrSteps = isArray(stepOrSteps) ? stepOrSteps : [stepOrSteps, null];
    toBeginning = toBeginning || false;
    numberOfTimes = numberOfTimes || 1;
    let isMultipleSteps = isArray(stepOrSteps[0]);

    if (!isMultipleSteps) {
      stepOrSteps = queueMany(numberOfTimes, stepOrSteps);
    }

    // Set a unique ID onto each queue item added.
    stepOrSteps = _setIdOnItems(stepOrSteps);

    _queue = toBeginning
      ? stepOrSteps.concat(_queue)
      : _queue.concat(stepOrSteps);

    return this;
  };

  /**
   * Given an index, set an item in the queue.
   *
   * @param {integer} index
   * @return {array}
   */
  this.set = function(index, item) {
    _queue[index] = item;
  };

  /**
   * Move all `executed` queue items to `waiting`.
   *
   * @return {object}
   */
  this.reset = function() {
    _queue = _queue.map(item => {
      item[2].executed = false;
      return item;
    });
  };

  /**
   * Retrieve all items that are still eligible to be executed.
   *
   * @return {array}
   */
  this.getItems = function() {
    _queue = guaranteeThreeKeys(_queue);

    return _queue.filter(i => {
      return !i[2].executed;
    });
  };

  /**
   * Given an ID for a particular queue item, update the meta on that item.
   *
   * @returns {void}
   */
  this.setMeta = function(id, meta) {
    let index = _queue.findIndex(i => i[2].id === id);
    _queue[index][2] = merge(_queue[index][2], meta);
  };

  let _queue = [];
  let _id = 0;

  this.add(initialItem);
}
