import Core from "./core";

export default class TypeIt extends Core {
  constructor(element, args, autoInit = true) {
    super(element, args, autoInit);
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

  /**
   * If used after typing has started, will append strings to the end of the existing queue. If used when typing is paused, will restart it.
   *
   * @param  {string} string The string to be typed.
   * @return {object} TypeIt instance
   */
  type(string = "") {
    this.init(true);

    this.instances.forEach(instance => {
      //-- Queue up a string right off the bat.
      instance.queueString(string);

      if (instance.isComplete === true) {
        instance.next();
      }

      //-- We KNOW we have items to process now, so make sure we set this to false.
      instance.isComplete = false;
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
        instance.elementWrapper.removeChild(
          instance.elementWrapper.querySelector(".ti-cursor")
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

  init(requireAutoInit = false) {
    this.instances.forEach(instance => {
      if (!requireAutoInit) {
        instance.init();
        return;
      }

      if (instance.autoInit) {
        instance.init();
      }
    });
  }
}
