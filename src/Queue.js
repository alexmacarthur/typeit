import guaranteeThreeKeys from "./helpers/guaranteeThreeKeys";
import queueMany from "./helpers/queueMany";

export default function Queue(initialItem) {
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
    stepOrSteps = Array.isArray(stepOrSteps)
      ? stepOrSteps
      : [stepOrSteps, null];
    toBeginning = toBeginning || false;
    numberOfTimes = numberOfTimes || 1;
    let isMultipleSteps = Array.isArray(stepOrSteps[0]);

    if (!isMultipleSteps) {
      stepOrSteps = queueMany(numberOfTimes, stepOrSteps);
    }

    _queue = toBeginning
      ? stepOrSteps.concat(_queue)
      : _queue.concat(stepOrSteps);

    return this;
  };

  /**
   * Given an index, remove the last item on the `waiting` queue.
   *
   * @param {integer} index
   * @return {object}
   */
  this.delete = function(index) {
    _queue.splice(index, 1);
    return this;
  };

  /**
   * Move all `executed` queue items to `waiting`.
   *
   * @return {object}
   */
  this.reset = function() {
    _queue = guaranteeThreeKeys(_queue).map(item => {
      item[2].executed = false;
      return item;
    });

    return this;
  };

  /**
   * Retrieve all items that are still eligible to be executed.
   *
   * @return {array}
   */
  this.getItems = function() {
    return guaranteeThreeKeys(_queue).filter(i => !i.executed);
  };

  let _queue = [];

  // Don't include initial item if we're recycling
  // items from a previous run.
  if (initialItem) {
    this.add(initialItem);
  }
}
