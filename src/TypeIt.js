import Instance from "./Instance";
import allHaveStatus from "./helpers/allHaveStatus";
import { generateHash } from "./utilities";
import toArrayOfNodes from "./helpers/toArrayOfNodes";

export default class TypeIt {
  constructor(element, options) {
    this.instances = toArrayOfNodes(element).map(el => {
      return new Instance({
        element: el,
        id: generateHash(),
        options,
        queue: []
      });
    });
  }

  each(func) {
    this.instances.forEach(instance => {
      func.call(this, instance);
    });
  }

  /**
   * Push a specific action directly into the queue of each instance.
   * If an instance has already completed, trigger the queeu again.
   *
   * @param {string} function
   * @param {*} argument
   * @
   */
  queueUp(action, argument = null, numberOfTimesToCopy = 1) {
    this.each(instance => {
      let isIndependentFunction = typeof action !== "string";

      /**
       * If action is a string, bind it to instance.
       * Otherwise, leave it on its own.
       */
      let toFire = isIndependentFunction ? action : instance[action];

      let toPassAsArguments = isIndependentFunction ? this : argument;

      for (let i = 0; i < numberOfTimesToCopy; i++) {
        instance.queue.add([toFire, toPassAsArguments]);
      }
    });
  }

  is(status) {
    return allHaveStatus(this.instances, status, true);
  }

  freeze() {
    this.each(instance => {
      instance.status.frozen = true;
    });
  }

  unfreeze() {
    this.each(instance => {
      if (!instance.status.frozen) return;
      instance.status.frozen = false;
      instance.fire();
    });
  }

  /**
   * If used after typing has started, will append strings to the end of the existing queue. If used when typing is paused, will restart it.
   *
   * @param  {string} string The string to be typed.
   * @return {object} TypeIt instance
   */
  type(string = "") {
    this.each(instance => instance.queueString(string));
    return this;
  }

  /**
   * If null is passed, will delete whatever's currently in the element.
   *
   * @param  { number } numCharacters Number of characters to delete.
   * @return { TypeIt }
   */
  delete(numberOfCharactersToDelete = null) {
    this.queueUp(
      "delete",
      numberOfCharactersToDelete === null, //-- Maybe delete all.
      numberOfCharactersToDelete === null ? 1 : numberOfCharactersToDelete
    );

    return this;
  }

  pause(ms = null) {
    this.queueUp("pause", ms);
    return this;
  }

  break() {
    this.queueUp("type", "<br>");
    return this;
  }

  options(options) {
    this.queueUp("setOptions", options);
    return this;
  }

  exec(func) {
    this.queueUp(func);
    return this;
  }

  /**
   * Destroy the instance, mark as such, and clean up.
   *
   * @param {} removeCursor
   */
  destroy(removeCursor = true) {
    this.each(instance => {
      instance.timeouts.forEach(timeout => {
        clearTimeout(timeout);
      });

      instance.timeouts = [];

      let cursorNode = instance.isInput
        ? null
        : instance.$eWrapper.querySelector(".ti-cursor");

      if (removeCursor && instance.opts.cursor && cursorNode !== null) {
        instance.$eWrapper.removeChild(cursorNode);
      }

      instance.status.destroyed = true;
    });
  }

  empty() {
    this.queueUp("empty");
    return this;
  }

  /**
   * Reset each instance like it's brand new.
   */
  reset() {
    this.destroy();

    this.instances = this.instances.map(instance => {
      return instance.reset();
    });

    return this;
  }

  /**
   * Initialize each instance.
   */
  go() {
    this.each(instance => {
      instance.init();
    });

    return this;
  }
}
