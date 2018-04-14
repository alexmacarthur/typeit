import { generateHash } from "./utilities";
import Instance from "./instance";

export default class TypeIt {
  constructor(element, args, autoInit = true) {
    this.id = generateHash();
    this.instances = [];
    this.elements = [];
    this.args = args;
    this.autoInit = autoInit;

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

    this.generateInstances();
  }

  get isComplete() {
    if (!this.instances.length) return false;

    return this.instances[0].isComplete;
  }

  get hasBeenDestroyed() {
    if (!this.instances.length) return false;

    return this.instances[0].hasBeenDestroyed;
  }

  get hasStarted() {
    if (!this.instances.length) return false;

    return this.instances[0].hasStarted;
  }

  get isFrozen() {
    if (!this.instances.length) return false;

    return this.instances[0].isFrozen;
  }

  generateInstances() {
    [].slice.call(this.elements).forEach(element => {
      this.instances.push(
        new Instance(element, this.id, this.args, this.autoInit, this)
      );
    });
  }

  /**
   * Push a specific action into the queue of each instance.
   * If an instance has already completed, trigger the queeu again.
   *
   * @param {string} function
   * @param {*} argument
   */
  queueUp(action, argument = null) {
    this.instances.forEach(instance => {
      instance.queue.push([instance[action], argument]);

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
      instance.queueString(string);

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
    this.queueUp("delete", numCharacters);
    return this;
  }

  pause(ms = null) {
    this.queueUp("pause", ms);
    return this;
  }

  empty() {
    this.queueUp("empty");
    return this;
  }

  break() {
    this.queueUp("break");
    return this;
  }

  options(options) {
    this.queueUp("setOptions", options);
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

  destroy(removeCursor = true) {
    this.instances.forEach(instance => {
      instance.timeouts.forEach(timeout => {
        clearTimeout(timeout);
      });

      instance.timeouts = [];

      if (removeCursor && instance.options.cursor) {
        instance.element.removeChild(
          instance.element.querySelector(".ti-cursor")
        );
      }

      instance.hasBeenDestroyed = true;
    });
  }

  /**
   * Reset each instance with a new instance.
   */
  reset() {
    this.instances = this.instances.map(instance => {
      return instance.reset();
    });
  }

  init() {
    this.instances.forEach(instance => {
      instance.init();
    });
  }
}
