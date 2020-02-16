import defaults from "./defaults.js";
import Queue from "./Queue";
import { removeComments, appendStyleBlock } from "./utilities";
import {
  chunkStringAsHtml,
  maybeChunkStringAsHtml,
  createCharacterObject
} from "./helpers/chunkStrings";
import asArray from "./helpers/asArray";
import calculateDelay from "./helpers/calculateDelay.js";
import calculatePace from "./helpers/calculatePace.js";
import clearPreviousMarkup from "./helpers/clearPreviousMarkup";
import createElement from "./helpers/createElement";
import getAllTypeableNodes from "./helpers/getAllTypeableNodes.js";
import getParsedBody from "./helpers/getParsedBody.js";
import insertIntoElement from "./helpers/insertIntoElement";
import isInput from "./helpers/isInput";
import queueMany from "./helpers/queueMany";
import removeNode from "./helpers/removeNode";
import removeEmptyElements from "./helpers/removeEmptyElements";
import repositionCursor from "./helpers/repositionCursor";
import toArray from "./helpers/toArray";

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
    if (elementIsInput) {
      return toArray(this.$e.value);
    }

    return getAllTypeableNodes(this.$e, cursor, true);
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
      return null;
    }

    // If we have a cursor node from a previous instance (prior to a reset()),
    // there's no need to recreate one now.
    let cursor = createElement("span");
    cursor.innerHTML = getParsedBody(this.opts.cursorChar).innerHTML;
    cursor.className = "ti-cursor";
    cursor.setAttribute(
      "style",
      "display:inline;position:absolute;font:inherit;color:inherit;line-height:inherit;margin-left:-.1em;"
    );

    return cursor;
  };

  /**
   * If a cursor node's been generated, attach it to the DOM so
   * it appears for the user, along with the required CSS transition.
   *
   * @return void
   */
  const maybeAttachCursor = () => {
    if (!cursor) {
      return;
    }

    appendStyleBlock(
      `@keyframes blink-${id} { 0% {opacity: 0} 49% {opacity: 0} 50% {opacity: 1} }[data-typeit-id='${id}'] .ti-cursor { animation: blink-${id} ${this
        .opts.cursorSpeed / 1000}s infinite; }`,
      id
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
  this.wait = async function(callback, delay) {
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
      let chunkedString = maybeChunkStringAsHtml(string, this.opts.html);

      this.queue.add(queueMany(chunkedString, this.type, true));

      let queueLength = this.queue.waiting.length;

      // This is the last string. Get outta here.
      if (index + 1 === this.opts.strings.length) return;

      if (this.opts.breakLines) {
        let breakObj = createCharacterObject(createElement("BR"));
        this.queue.add([this.type, breakObj]);
        addSplitPause(queueLength);
        return;
      }

      this.queue.add(queueMany(chunkedString, this.delete));
      addSplitPause(queueLength, string.length);
    });
  };

  /**
   * 1. Reset queue.
   * 2. Remove initial pause.
   * 3. Add phantom deletions.
   */
  const loopify = async delay => {
    // Reset queue.
    // Remove initial pause, so we can replace with `loop` pause.
    // Add delay pause FIRST, since we're adding to beginning of queue.

    // Reset the cursor position!
    if (_cursorPosition) {
      await this.move(_cursorPosition * -1);
    }

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
        insertIntoElement(this.$e, item, cursor, _cursorPosition);
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

    maybeAttachCursor();

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

  this.fire = async function() {
    let queue = this.queue.waiting.slice();

    try {
      for (let i = 0; i < queue.length; i++) {
        let key = queue[i];
        let callbackArgs = [key, this.queue, typeIt];

        if (this.status.frozen) {
          throw new Error();
        }

        this.pace = calculatePace(
          this.opts.speed,
          this.opts.deleteSpeed,
          this.opts.lifeLike
        );

        if (key[2] && key[2].isFirst) {
          await this.opts.beforeString(...callbackArgs);
        }

        await this.opts.beforeStep(...callbackArgs);

        // Fire this step! During this process, pluck items from the waiting
        // queue and move them to executed.
        await key[0].call(this, key[1], key[2]);

        let justExecuted = this.queue.waiting.shift();
        let isAPhantomItem = key[2] && key[2].isPhantom;

        // If this is a phantom item, as soon as it's executed,
        // remove it from the queue and pretend it never existed.
        if (!isAPhantomItem) {
          if (key[2] && key[2].isLast) {
            await this.opts.afterString(...callbackArgs);
          }

          await this.opts.afterStep(...callbackArgs);

          // Remove this item from the global queue. Needed for pausing.
          this.queue.executed.push(justExecuted);
        }
      }

      this.status.completed = true;
      await this.opts.afterComplete(typeIt);

      if (this.opts.loop) {
        // Split the delay!
        let delay = this.opts.loopDelay
          ? this.opts.loopDelay
          : this.opts.nextStringDelay;

        this.wait(async () => {
          await loopify(delay);
          this.fire();
        }, delay.after);
      }
    } catch (e) {}
  };

  this.type = function(characterObject) {
    return new Promise(resolve => {
      this.wait(() => {
        insertIntoElement(this.$e, characterObject, cursor, _cursorPosition);
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
  this.empty = async function() {
    if (elementIsInput) {
      this.$e.value = "";
      return;
    }

    toArray(this.$e.childNodes).forEach(n => {
      if (!cursor || !cursor.isEqualNode(n)) {
        removeNode(n);
      }
    });

    return;
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
          if (elementIsInput) {
            this.$e.value = this.$e.value.slice(0, -1);
          } else if (allChars[_cursorPosition]) {
            removeNode(allChars[_cursorPosition]);
          }
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
   */
  this.setOptions = async function(options) {
    this.opts = Object.assign({}, this.opts, options);
    return;
  };

  /**
   * Move type cursor by a given number.
   *
   * @param {integer} stepsToMove
   */
  this.move = function(stepsToMove) {
    return new Promise(resolve => {
      this.wait(() => {
        _cursorPosition += stepsToMove;
        repositionCursor(this.$e, getAllChars(), cursor, _cursorPosition);
        return resolve();
      }, this.pace[0]);
    });
  };

  let elementIsInput = isInput(element);

  this.status = {
    started: false,
    complete: false,
    frozen: false,
    destroyed: false
  };
  this.$e = element;
  this.timeouts = [];

  // Relative to the end of the container.
  let _cursorPosition = 0;
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

  let strings = asArray(this.opts.strings);
  strings = maybePrependHardcodedStrings(strings);
  this.opts.strings = removeComments(strings);

  let cursor = setUpCursor();

  // Only generate a queue if we have strings
  // and this isn't a reset of a previous instance,
  // in which case we'd have a pre-defined queue.
  if (this.opts.strings.length && !isAReset) {
    generateQueue();
  }
}
