export default function(predefinedItems = [], initialItem = null) {
  /**
   * Insert items into the `waiting` queue.
   *
   * @param {integer} start
   * @param {array} newItems
   */
  this.insert = (start, newItems) => {
    this.waiting.splice(start, 0, newItems);
  };

  /**
   * Add a single or several steps onto the `waiting` queue.
   *
   * @param {array} stepOrSteps
   * @param {boolean} toBeginning
   * @return {object}
   */
  this.add = (stepOrSteps, toBeginning = false) => {
    // Way to check if this multiple steps being added at once.
    if (Array.isArray(stepOrSteps[0])) {
      this.waiting = this.waiting.concat(stepOrSteps);
      return this;
    }

    this.waiting[toBeginning ? "unshift" : "push"](stepOrSteps);
    return this;
  };

  /**
   * Given an index, remove the last item on the `waiting` queue.
   *
   * @param {integer} index
   * @return {object}
   */
  this.delete = index => {
    this.waiting.splice(index, 1);
    return this;
  };

  /**
   * Move all `executed` queue items to `waiting`.
   *
   * @return {object}
   */
  this.reset = () => {
    this.waiting = this.executed.concat(this.waiting);
    this.executed = [];
    return this;
  };

  this.executed = [];
  this.waiting = predefinedItems;

  // Don't include initial item if we're recycling
  // items from a previous run.
  if (!predefinedItems.length && initialItem) {
    this.add(initialItem);
  }
}
