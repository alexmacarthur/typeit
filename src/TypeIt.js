import Instance from "./Instance";
import allHaveStatus from "./helpers/allHaveStatus";
import queueMany from "./helpers/queueMany";
import { generateHash } from "./utilities";
import toArrayOfNodes from "./helpers/toArrayOfNodes";
import { maybeChunkStringAsHtml } from "./helpers/chunkStrings";
import createElement from "./helpers/createElement";

export default function TypeIt(element, options) {
  this.instances = toArrayOfNodes(element).map(el => {
    return new Instance({
      typeIt: this,
      element: el,
      id: generateHash(),
      options,
      queue: [],
      isAReset: false
    });
  });

  /**
   * Perform a given function on every instance.
   *
   * @param {object} func
   */
  const each = func => {
    this.instances.forEach(instance => {
      func.call(this, instance);
    });
  };

  /**
   * Push a specific action directly into the queue of each instance.
   * If an instance has already completed, trigger the queeu again.
   *
   * @param {string} function
   * @param {*} argument
   */
  const queueUp = (action, argument = null, numberOfTimesToCopy = 1) => {
    each(instance => {
      let isIndependentFunction = typeof action !== "string";

      /**
       * If action is a string, bind it to instance.
       * Otherwise, leave it on its own.
       */
      let toFire = isIndependentFunction ? action : instance[action];
      let toPassAsArguments = isIndependentFunction ? this : argument;
      let queueItems = queueMany(numberOfTimesToCopy, [
        toFire,
        toPassAsArguments
      ]);

      instance.queue.add(queueItems);
    });
  };

  /**
   * Determine if all sub-instances have a particular status.
   *
   * @param {string} status
   */
  this.is = function(status) {
    return allHaveStatus(this.instances, status, true);
  };

  /**
   * Set each sub-instance's status to `frozen`.
   */
  this.freeze = function() {
    each(instance => {
      instance.status.frozen = true;
    });
  };

  /**
   * Give all sub-instance a non-frozen status
   * and re-fire queue execution.
   */
  this.unfreeze = function() {
    each(instance => {
      if (!instance.status.frozen) return;
      instance.status.frozen = false;
      instance.fire();
    });
  };

  /**
   * If used after typing has started, will append strings to the end of the existing queue. If used when typing is paused, will restart it.
   *
   * @param  {string} string The string to be typed.
   * @return {object} TypeIt instance
   */
  this.type = function(string = "") {
    each(instance => {
      let itemizedString = maybeChunkStringAsHtml(string, instance.opts.html);
      instance.queue.add(queueMany(itemizedString, instance.type, true));
    });

    return this;
  };

  /**
   * If null is passed, will delete whatever's currently in the element.
   *
   * @param  { number } numCharacters Number of characters to delete.
   * @return { TypeIt }
   */
  this.delete = function(numberOfCharactersToDelete = null) {
    queueUp(
      "delete",
      numberOfCharactersToDelete === null, // Maybe delete all.
      numberOfCharactersToDelete === null ? 1 : numberOfCharactersToDelete
    );

    return this;
  };

  /**
   * Add a `pause` event to each sub-instance's queue.
   *
   * @param {integer} ms
   * @return {object}
   */
  this.pause = function(ms = null) {
    queueUp("pause", ms);
    return this;
  };

  /**
   * Add a <br> element to each sub-instance's queue.
   * @return {object}
   */
  this.break = function() {
    queueUp("type", createElement("BR"));
    return this;
  };

  /**
   * Add a `setOptions` event to each sub-instance's queue.
   *
   * @param {object} options
   * @return {object}
   */
  this.options = function(opts) {
    queueUp("setOptions", opts);
    return this;
  };

  /**
   * Add a particular function to be queued in each sub-instance.
   *
   * @param {object} func
   * @return {object}
   */
  this.exec = function(func) {
    queueUp(func);
    return this;
  };

  /**
   * Destroy the instance, mark as such, and clean up. If specified,
   * remove the cursor on destruction.
   *
   * @param {boolean} removeCursor
   */
  this.destroy = function(removeCursor = true) {
    this.instances = this.instances.map(instance => {
      instance.timeouts.forEach(timeout => {
        clearTimeout(timeout);
      });

      instance.timeouts = [];

      // Clean up cursor node, if specified.
      if (removeCursor) {
        let cursorNode = instance.isInput
          ? null
          : instance.$e.querySelector(".ti-cursor");

        if (cursorNode) {
          instance.$e.removeChild(cursorNode);
        }
      }

      instance.status.destroyed = true;

      return instance;
    });
  };

  /**
   * Add an `empty` event to each sub-instance's queue.
   * @return {object}
   */
  this.empty = function() {
    queueUp("empty");
    return this;
  };

  /**
   * Reset each instance like it's brand new.
   *
   * @return {object}
   */
  this.reset = function() {
    this.destroy();

    this.instances = this.instances.map(instance => {
      return instance.reset();
    });

    return this;
  };

  /**
   * Initialize each sub-instance.
   *
   * @return {object}
   */
  this.go = function() {
    each(instance => {
      instance.init();
    });

    return this;
  };
}
