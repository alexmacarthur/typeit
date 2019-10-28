import defaults from "./defaults.js";
import Queue from "./Queue";
import { removeComments, appendStyleBlock } from "./utilities";
import isInput from "./helpers/isInput";
import toArray from "./helpers/toArray";
import nodeCollectionToArray from "./helpers/nodeCollectionToArray";
import insertIntoElement from "./helpers/insertIntoElement";
import {
  convertNodesToChunks,
  chunkStringAsHtml,
  maybeChunkStringAsHtml
} from "./helpers/chunkStrings";
import clearPreviousMarkup from "./helpers/clearPreviousMarkup";
import queueMany from "./helpers/queueMany";
import removeNode from "./helpers/removeNode";
import removeEmptyElements from "./helpers/removeEmptyElements";
import calculateDelay from "./helpers/calculateDelay.js";
import calculatePace from "./helpers/calculatePace.js";
import getParsedBody from "./helpers/getParsedBody.js";
import createElement from "./helpers/createElement";

export default function Instance({
  typeIt,
  element,
  id,
  options,
  queue = [],
  isAReset = false
} = {}) {
  /**
   * Get a flattened array of text nodes that have been typed.
   * This excludes any cursor character that might exist.
   *
   * @return {array}
   */
  const getAllChars = () => {
    let allNodes = nodeCollectionToArray(this.$e.childNodes).filter(
      node => !node.isEqualNode(cursor)
    );
    return convertNodesToChunks(allNodes, false);
  };

  /**
   * Insert a split pause around a range of queue items.
   *
   * @param  {Number} startPosition The array position at which to start wrapping.
   * @param  {Number} numberOfActionsToWrap The number of actions in the queue to wrap.
   * @return {void}
   */
  const addSplitPause = (startPosition, numberOfActionsToWrap = 1) => {
    let delay = this.opts.nextStringDelay;
    this.queue.insert(startPosition, [this.pause, delay.before]);
    this.queue.insert(startPosition + numberOfActionsToWrap + 1, [
      this.pause,
      delay.after
    ]);
  };

  /**
   * Provided it's a non-form element and the options is provided,
   * set up the cursor element for the instance.
   *
   * @return {void}
   */
  const setUpCursor = () => {
    if (elementIsInput || !this.opts.cursor) {
      return;
    }

    appendStyleBlock(
      `@keyframes blink-${id} { 0% {opacity: 0} 49% {opacity: 0} 50% {opacity: 1} }[data-typeit-id='${id}'] .ti-cursor { animation: blink-${id} ${this
        .opts.cursorSpeed / 1000}s infinite; }`,
      id
    );

    // If we have a cursor node from a previous instance (prior to a reset()),
    // there's no need to recreate one now.
    cursor = createElement("span");
    cursor.innerHTML = getParsedBody(this.opts.cursorChar).innerHTML;
    cursor.className = "ti-cursor";
    cursor.setAttribute(
      "style",
      "display:inline;position:relative;font:inherit;color:inherit;line-height:inherit;"
    );

    this.$e.appendChild(cursor);
  };

  /**
   * Fire a callback after a delay, adding the created timeout
   * to the `timeouts` instance property.
   *
   * @param {object} callback
   * @param {integer} delay
   */
  this.wait = function(callback, delay) {
    this.timeouts.push(setTimeout(callback, delay));
  };

  /**
   * Based on provided strings, generate a TypeIt queue
   * to be fired for each character in the string.
   *
   * @param {array|null} initialStep
   */
  const generateQueue = () => {
    this.opts.strings.forEach((string, index) => {
      let itemizedString = maybeChunkStringAsHtml(string, this.opts.html);

      this.queue.add(queueMany(itemizedString, this.type, true));

      let queueLength = this.queue.waiting.length;

      // This is the last string. Get outta here.
      if (index + 1 === this.opts.strings.length) return;

      if (this.opts.breakLines) {
        this.queue.add([this.type, createElement("BR")]);
        addSplitPause(queueLength);
        return;
      }

      this.queue.add(queueMany(itemizedString, this.delete));
      addSplitPause(queueLength, string.length);
    });
  };

  /**
   * 1. Reset queue.
   * 2. Remove initial pause.
   * 3. Add phantom deletions.
   */
  const loopify = delay => {
    // Reset queue.
    // Remove initial pause, so we can replace with `loop` pause.
    // Add delay pause FIRST, since we're adding to beginning of queue.

    this.queue
      .reset()
      .delete(0)
      .add([this.pause, delay.before], true);

    // Queue the current number of printed items for deletion.
    for (let i = 0; i < getAllChars().length; i++) {
      this.queue.add(
        [
          this.delete,
          null,
          {
            isPhantom: true
          }
        ],
        true
      );
    }
  };

  const maybePrependHardcodedStrings = strings => {
    let existingMarkup = this.$e.innerHTML;

    if (!existingMarkup) {
      return strings;
    }

    // Once we've saved the existing markup to a variable,
    // wipe the element clean to prepare for typing.
    this.$e.innerHTML = "";

    if (this.opts.startDelete) {
      chunkStringAsHtml(existingMarkup).forEach(item => {
        insertIntoElement(this.$e, item);
      });

      this.queue.add([this.delete, true]);
      addSplitPause(1);
      return strings;
    }

    return [existingMarkup.trim()].concat(strings);
  };

  this.pause = function(time = false) {
    return new Promise((resolve, reject) => {
      this.wait(
        () => {
          return resolve();
        },
        time ? time : this.opts.nextStringDelay.total
      );
    });
  };

  /**
   * Reset the instance to new status.
   */
  this.reset = function() {
    this.queue.reset();

    return new Instance({
      typeIt,
      element: this.$e,
      id: id,
      options: this.opts,
      queue: this.queue.waiting,
      isAReset: true
    });
  };

  /**
   * Kick off the typing animation.
   */
  this.init = function() {
    if (this.status.started) return;

    setUpCursor();

    if (!this.opts.waitUntilVisible) {
      this.status.started = true;
      return this.fire();
    }

    let observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.fire();
            observer.unobserve(this.$e);
          }
        });
      },
      { threshold: 1.0 }
    );

    observer.observe(this.$e);
  };

  this.fire = function() {
    let queue = this.queue.waiting.slice();
    let promiseChain = Promise.resolve();

    for (let i = 0; i < queue.length; i++) {
      let key = queue[i];
      let callbackArgs = [key, this.queue, typeIt];

      promiseChain = promiseChain.then(() => {
        return new Promise((resolve, reject) => {
          if (this.status.frozen) {
            return reject();
          }

          this.pace = calculatePace(
            this.opts.speed,
            this.opts.deleteSpeed,
            this.opts.lifeLike
          );

          if (key[2] && key[2].isFirst) {
            this.opts.beforeString(...callbackArgs);
          }

          this.opts.beforeStep(...callbackArgs);

          // Fire this step! During this process, pluck items from the waiting
          // queue and move them to executed.
          key[0].call(this, key[1], key[2]).then(() => {
            let justExecuted = this.queue.waiting.shift();

            // If this is a phantom item, as soon as it's executed,
            // remove it from the queue and pretend it never existed.
            if (key[2] && key[2].isPhantom) {
              return resolve();
            }

            if (key[2] && key[2].isLast) {
              this.opts.afterString(...callbackArgs);
            }

            this.opts.afterStep(...callbackArgs);

            // Remove this item from the global queue. Needed for pausing.
            this.queue.executed.push(justExecuted);

            return resolve();
          });
        });
      });
    }

    promiseChain
      .then(() => {
        if (this.opts.loop) {
          // Split the delay!
          let delay = this.opts.loopDelay
            ? this.opts.loopDelay
            : this.opts.nextStringDelay;

          this.wait(() => {
            loopify(delay);
            this.fire();
          }, delay.after);
        }

        this.status.completed = true;

        this.opts.afterComplete(typeIt);
        return;
      })
      .catch(() => {});
  };

  this.type = function(character) {
    // This is a shell character object, needed for creating
    // the shell of an HTML this.$e. Just print & go.
    if (typeof character === "object" && !character.content) {
      insertIntoElement(this.$e, character);
      return Promise.resolve();
    }

    return new Promise(resolve => {
      this.wait(() => {
        insertIntoElement(this.$e, character);
        return resolve();
      }, this.pace[0]);
    });
  };

  /**
   * Totally wipe out the contents of the target this.$e,
   * except for any cursor node that may exist.
   *
   * @return {object}
   */
  this.empty = function() {
    return new Promise(resolve => {
      if (elementIsInput) {
        this.$e.value = "";
      } else {
        nodeCollectionToArray(this.$e.childNodes).forEach(n => {
          if (!cursor.isEqualNode(n)) {
            removeNode(n);
          }
        });
      }
      return resolve();
    });
  };

  /**
   * Remove the last child node from the target this.$e.
   *
   * @param {boolean}
   * @param {object}
   */
  this.delete = function(keepGoingUntilAllIsGone = false) {
    return new Promise(resolve => {
      this.wait(() => {
        let allChars = getAllChars();

        if (allChars.length) {
          removeNode(allChars[allChars.length - 1]);
        }

        removeEmptyElements(this.$e);

        /**
         * If it's specified, keep deleting until all characters are gone. This is
         * the only time when a SINGLE queue action (`delete()`) deals with multiple
         * characters at once. I don't like it, but need to implement like this right now.
         */
        if (keepGoingUntilAllIsGone && allChars.length - 1 > 0) {
          return this.delete(true).then(() => {
            return resolve();
          });
        }

        return resolve();
      }, this.pace[1]);
    });
  };

  /**
   * Update this instance's options.
   *
   * @param {object}
   * @param {object}
   */
  this.setOptions = function(options) {
    return new Promise(resolve => {
      this.opts = Object.assign({}, this.opts, options);
      return resolve();
    });
  };

  let cursor = null;
  let elementIsInput = isInput(element);

  this.status = {
    started: false,
    complete: false,
    frozen: false,
    destroyed: false
  };
  this.$e = element;
  this.timeouts = [];
  this.opts = Object.assign({}, defaults, options);
  this.opts.html = elementIsInput ? false : this.opts.html;
  this.opts.nextStringDelay = calculateDelay(this.opts.nextStringDelay);
  this.opts.loopDelay = calculateDelay(this.opts.loopDelay);
  this.queue = new Queue(queue, [this.pause, this.opts.startDelay]);

  this.$e.setAttribute("data-typeit-id", id);

  // Used to set a "placeholder" space in the element, so that it holds vertical sizing before anything's typed.
  appendStyleBlock(
    `[data-typeit-id]:before {content: '.'; display: inline-block; width: 0; visibility: hidden;}`
  );

  clearPreviousMarkup(element, elementIsInput);

  let strings = toArray(this.opts.strings);
  strings = maybePrependHardcodedStrings(strings);
  this.opts.strings = removeComments(strings);

  // Only generate a queue if we have strings
  // and this isn't a reset of a previous instance,
  // in which case we'd have a pre-defined queue.
  if (this.opts.strings.length && !isAReset) {
    generateQueue();
  }
}
