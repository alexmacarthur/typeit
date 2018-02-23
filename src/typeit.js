import Instance from "./instance";

export default class TypeIt {
  constructor(element, args) {
    this.id = this.generateHash();
    this.instances = [];
    this.elements = [];
    this.args = args;

    if (typeof element === "object") {
      //-- There's only one!
      if (element.length === undefined) {
        this.elements.push(element);
      } else {
        //-- It's already an array!
        this.elements = element;
      }
    }

    //-- Convert to array of elements.
    if (typeof element === "string") {
      this.elements = document.querySelectorAll(element);
    }

    this.createInstances();
  }

  get isComplete() {
    return this.instances[0].isComplete;
  }

  generateHash() {
    return (
      Math.random()
        .toString(36)
        .substring(2, 15) +
      Math.random()
        .toString(36)
        .substring(2, 15)
    );
  }

  createInstances() {
    [].slice.call(this.elements).forEach(element => {
      this.instances.push(new Instance(element, this.id, this.args));
    });
  }

  pushAction(func, argument = null) {
    this.instances.forEach(instance => {
      instance.queue.push([instance[func], argument]);

      if (instance.isComplete === true) {
        instance.next();
      }
    });
  }

  /**
   * If used after typing has started, will append strings to the end of the existing queue. If used when typing is paused, will restart it.
   *
   * @param  {string} string The string to be typed.
   * @return {object} TypeIt instance
   */
  type(string = "") {
    this.instances.forEach(instance => {
      //-- Queue up a string right off the bat.
      instance.queueUpString(string);

      if (instance.isComplete === true) {
        instance.next();
      }
    });

    return this;
  }

  /**
   * If null is passed, will delete whatever's currently in the element.
   *
   * @param  { number } numCharacters Number of characters to delete.
   * @return { TypeIt }
   */
  delete(numCharacters = null) {
    this.pushAction("delete", numCharacters);
    return this;
  }

  freeze() {
    this.instances.forEach(instance => {
      instance.isFrozen = true;
    });
  }

  unfreeze() {
    this.instances.forEach(instance => {
      if (!instance.isFrozen) return;

      instance.isFrozen = false;
      instance.next();
    });
  }

  pause(ms = null) {
    this.pushAction("pause", ms);
    return this;
  }

  destroy(removeCursor = true) {
    this.instances.forEach(instance => {
      instance.timeouts = instance.timeouts.map(timeout => {
        clearTimeout(timeout);
        return null;
      });

      if (removeCursor) {
        instance.element.removeChild(
          instance.element.querySelector(".ti-cursor")
        );
      }
    });

    this.instances = [];
  }

  empty() {
    this.pushAction("empty");
    return this;
  }

  break() {
    this.pushAction("break");
    return this;
  }

  options(options) {
    this.pushAction("setOptions", options);
    return this;
  }
}
