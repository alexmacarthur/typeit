export default class {
  constructor(predefinedItems = [], initialItem = false) {
    this.executed = [];
    this.waiting = predefinedItems;

    //-- Don't include initial item if we're recycling
    //-- items from a previous run.
    if (!predefinedItems.length && initialItem) {
      this.add(initialItem);
    }
  }

  add(step, toBeginning = false) {
    this.waiting[toBeginning ? "unshift" : "push"](step);
    return this;
  }

  delete(index) {
    this.waiting.splice(index, 1);
    return this;
  }

  reset() {
    this.waiting = [...this.executed, ...this.waiting];
    this.executed = [];
    return this;
  }
}
