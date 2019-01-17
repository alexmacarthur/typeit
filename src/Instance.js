import defaults from "./defaults.js";
import {
  isVisible,
  randomInRange,
  removeComments,
  appendStyleBlock
} from "./utilities";
import merge from "./helpers/merge";
import isInput from "./helpers/isInput";
import toArray from "./helpers/toArray";
import noderize from "./helpers/noderize";
import createNodeString from "./helpers/createNodeString";
import clearPreviousMarkup from "./helpers/clearPreviousMarkup";
import groupNodeStringContents from "./helpers/groupNodeStringContents";

import Queue from "./Queue";

let baseInlineStyles =
  "display:inline;position:relative;font:inherit;color:inherit;line-height:inherit;";

export default class Instance {
  constructor({ element, id, options, queue = [] } = {}) {
    this.status = {
      started: false,
      complete: false,
      frozen: false,
      destroyed: false
    };
    this.timeouts = [];
    this.id = id;
    this.$e = element;
    this.isInput = isInput(element);
    this.opts = merge({}, defaults, options);
    this.opts.strings = toArray(this.opts.strings);
    this.opts.html = this.isInput ? false : this.opts.html;
    this.queue = new Queue(queue, [this.pause, this.opts.startDelay]);

    clearPreviousMarkup(element, this.isInput);

    this.prepareDelay("nextStringDelay");
    this.prepareDelay("loopDelay");

    let existingMarkup = this.$e.innerHTML;

    this.prepDOM();
    this.handleHardCoded(existingMarkup);

    this.opts.strings = removeComments(this.opts.strings);

    //-- Only generate a queue if we have strings
    //-- and we're NOT receiving a pre-defined queue.
    if (!this.opts.strings.length || this.queue.waiting.length > 1) {
      return;
    }

    this.generateQueue();
  }

  /**
   * Reset the instance to new status.
   */
  reset() {
    this.queue.reset();

    return new Instance({
      element: this.$e,
      id: this.id,
      options: this.opts,
      queue: this.queue.waiting
    });
  }

  init() {
    if (this.status.started) return;

    this.cursor();

    if (!this.opts.waitUntilVisible || isVisible(this.$e)) {
      this.status.started = true;

      return this.fire();
    }

    const checkForStart = () => {
      if (isVisible(this.$e) && !this.status.started) {
        this.fire();
        window.removeEventListener("scroll", checkForStart);
      }
    };

    window.addEventListener("scroll", checkForStart);
  }

  fire() {
    let queue = this.queue.waiting.slice();
    let promiseChain = Promise.resolve();

    for (let i = 0; i < queue.length; i++) {
      let key = queue[i];

      let callbackArgs = [key, this.queue, this];

      promiseChain = promiseChain.then(() => {
        return new Promise((resolve, reject) => {
          if (this.status.frozen) {
            return reject();
          }

          this.setPace();

          if (key[2] && key[2].isFirst && this.opts.beforeString) {
            this.opts.beforeString(...callbackArgs);
          }

          if (this.opts.beforeStep) {
            this.opts.beforeStep(...callbackArgs);
          }

          //-- Fire this step!
          key[0].call(this, key[1], key[2]).then(() => {
            let justExecuted = this.queue.waiting.shift();

            //-- If this is a phantom item, as soon as it's executed,
            //-- remove it from the queue and pretend it never existed.
            if (key[2] && key[2].isPhantom) {
              return resolve();
            }

            if (key[2] && key[2].isLast && this.opts.afterString) {
              this.opts.afterString(...callbackArgs);
            }

            if (this.opts.afterStep) {
              this.opts.afterStep(...callbackArgs);
            }

            //-- Remove this item from the global queue. Needed for pausing.
            this.queue.executed.push(justExecuted);

            return resolve();
          });
        });
      });
    }

    promiseChain
      .then(() => {
        if (this.opts.loop) {
          //-- Split the delay!
          let delay = this.opts.loopDelay
            ? this.opts.loopDelay
            : this.opts.nextStringDelay;

          this.wait(() => {
            this.loopify(delay);
            this.fire();
          }, delay.after);
        }

        this.status.completed = true;

        if (this.opts.afterComplete) {
          this.opts.afterComplete(this);
        }

        return;
      })
      .catch(() => {});
  }

  /**
   * 1. Reset queue.
   * 2. Remove initial pause.
   * 3. Add phantom deletions.
   */
  loopify(delay) {
    //-- Reset queue.
    //-- Remove initial pause, so we can replace with `loop` pause.
    //-- Add delay pause FIRST, since we're adding to beginning of queue.
    this.queue
      .reset()
      .delete(0)
      .add([this.pause, delay.before], true);

    this.getNoderized().forEach(item => {
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
    });
  }

  /**
   * Performs DOM-related work to prepare for typing.
   */
  prepDOM() {
    if (this.isInput) return;

    this.$e.innerHTML = `
      <span style="${baseInlineStyles}" class="ti-wrapper">
        <span style="${baseInlineStyles}" class="ti-container"></span>
      </span>
      `;
    this.$e.setAttribute("data-typeit-id", this.id);
    this.$eContainer = this.$e.querySelector(".ti-container");
    this.$eWrapper = this.$e.querySelector(".ti-wrapper");

    appendStyleBlock(
      `
        .${this.$eContainer.className}:before {
          content: '.';
          display: inline-block;
          width: 0;
          visibility: hidden;
        }
      `
    );
  }

  /**
   * Set to content according to `html` option.
   * @param {string | null} content
   * @todo Test this!
   */
  setContents(content = "") {
    if (this.isInput) {
      this.$e.value = content;
    } else {
      this.$eContainer[this.opts.html ? "innerHTML" : "innerText"] = content;
    }
  }

  /**
   * Get the raw content in the element, unnoderized.
   */
  getRaw() {
    if (this.isInput) {
      return this.$e.value;
    }

    return this.opts.html
      ? this.$eContainer.innerHTML
      : this.$eContainer.innerText;
  }

  getNoderized() {
    return this.maybeNoderize(this.getRaw());
  }

  prepareDelay(delayType) {
    let delay = this.opts[delayType];

    if (!delay) return;

    let isArray = Array.isArray(delay);
    let halfDelay = !isArray ? delay / 2 : null;

    this.opts[delayType] = {
      before: isArray ? delay[0] : halfDelay,
      after: isArray ? delay[1] : halfDelay,
      total: isArray ? delay[0] + delay[1] : delay
    };
  }

  generateQueue(initialStep = null) {
    if (initialStep) {
      this.queue.add(initialStep);
    }

    this.opts.strings.forEach((string, index) => {
      this.queueString(string);

      let queueLength = this.queue.waiting.length;

      //-- This is the last string. Get outta here.
      if (index + 1 === this.opts.strings.length) return;

      if (this.opts.breakLines) {
        this.queue.add([this.type, "<br>"]);
        this.addSplitPause(queueLength);
        return;
      }

      this.queueDeletions(string);
      this.addSplitPause(queueLength, string.length);
    });
  }

  /**
   * Delete each character from a string.
   *
   * @todo Why am I accepting a string or number?
   */
  queueDeletions(stringOrNumber = null) {
    let numberOfCharsToDelete =
      typeof stringOrNumber === "string"
        ? this.maybeNoderize(stringOrNumber).length
        : stringOrNumber;

    for (let i = 0; i < numberOfCharsToDelete; i++) {
      this.queue.add([this.delete]);
    }
  }

  /**
   * Based on HTML options, noderize the string,
   * always ensuring its returned as split pieces.
   *
   * @param {array} stuff
   */
  maybeNoderize(stuff) {
    if (!this.opts.html) {
      return stuff.split("");
    }

    return noderize(stuff);
  }

  /**
   * Add steps to the queue for each character in a given string.
   */
  queueString(string) {
    //-- Get array of string with nodes where applicable.
    string = this.maybeNoderize(string);

    let strLength = string.length;

    //-- Push each array item to the queue.
    string.forEach((item, index) => {
      let queueItem = [this.type, item];

      //-- Tag as first character of string for callback usage.
      if (index === 0) {
        queueItem.push({
          isFirst: true
        });
      }

      if (index + 1 === strLength) {
        queueItem.push({
          isLast: true
        });
      }

      this.queue.add(queueItem);
    });
  }

  /**
   * Insert a split pause around a range of queue items.
   *
   * @param  {Number} startPosition The array position at which to start wrapping.
   * @param  {Number} numberOfActionsToWrap The number of actions in the queue to wrap.
   * @return {void}
   */
  addSplitPause(startPosition, numberOfActionsToWrap = 1) {
    this.queue.waiting.splice(startPosition, 0, [
      this.pause,
      this.opts.nextStringDelay.before
    ]);

    this.queue.waiting.splice(startPosition + numberOfActionsToWrap + 1, 0, [
      this.pause,
      this.opts.nextStringDelay.after
    ]);
  }

  cursor() {
    if (this.isInput) return;

    let visibilityStyle = "display: none;";

    if (this.opts.cursor) {
      appendStyleBlock(
        `
        @keyframes blink-${this.id} {
          0% {opacity: 0}
          49% {opacity: 0}
          50% {opacity: 1}
        }

        [data-typeit-id='${this.id}'] .ti-cursor {
          animation: blink-${this.id} ${this.opts.cursorSpeed / 1000}s infinite;
        }
      `,
        this.id
      );

      visibilityStyle = "";
    }

    this.$eWrapper.insertAdjacentHTML(
      "beforeend",
      `<span style="${baseInlineStyles}${visibilityStyle}left: -.25ch;" class="ti-cursor">${
        this.opts.cursorChar
      }</span>`
    );
  }

  /**
   * Inserts string to element container.
   */
  insert(content, toChildNode = false) {
    if (this.isInput) {
      this.$e.value = `${this.$e.value}${content}`;
      return;
    }

    let el = toChildNode ? this.$eContainer.lastChild : this.$eContainer;

    el.insertAdjacentHTML("beforeend", content);

    this.setContents(
      this.getRaw()
        .split("")
        .join("")
    );
  }

  handleHardCoded(existing) {
    if (!existing.length) return false;

    if (this.opts.startDelete) {
      this.insert(existing);
      this.queue.add([this.delete, true]);
      this.addSplitPause(1);
      return;
    }

    this.opts.strings = [...toArray(existing.trim()), ...this.opts.strings];
  }

  wait(callback, delay) {
    this.timeouts.push(setTimeout(callback, delay));
  }

  setPace() {
    let typeSpeed = this.opts.speed;
    let deleteSpeed =
      this.opts.deleteSpeed !== null
        ? this.opts.deleteSpeed
        : this.opts.speed / 3;
    let typeRange = typeSpeed / 2;
    let deleteRange = deleteSpeed / 2;

    this.typePace = this.opts.lifeLike
      ? randomInRange(typeSpeed, typeRange)
      : typeSpeed;
    this.deletePace = this.opts.lifeLike
      ? randomInRange(deleteSpeed, deleteRange)
      : deleteSpeed;
  }

  /**
   * QUEUEABLE
   */
  pause(time = false) {
    return new Promise((resolve, reject) => {
      this.wait(
        () => {
          return resolve();
        },
        time ? time : this.opts.nextStringDelay.total
      );
    });
  }

  /**
   * QUEUEABLE - Type a SINGLE character.
   * @param {*} character
   */
  type(character) {
    return new Promise((resolve, reject) => {
      this.wait(() => {
        //-- We hit a standard string.
        if (typeof character === "string") {
          this.insert(character);
          return resolve();
        }

        //-- We hit a node; create tag itself only if it's:
        //-- 1) the first character
        //-- 2) a self-closing tag (content === null)
        if (character.isFirstCharacter || character.content === null) {
          this.insert(
            createNodeString({
              tag: character.tag,
              attributes: character.attributes,
              content: character.content
            })
          );

          return resolve();
        }

        this.insert(character.content, true);

        return resolve();
      }, this.typePace);
    });
  }

  /**
   * QUEUEABLE
   */
  empty() {
    return new Promise(resolve => {
      this.setContents("");
      return resolve();
    });
  }

  /**
   * QUEUEABLE
   */
  delete(keepGoingUntilAllIsGone = false) {
    return new Promise((resolve, reject) => {
      this.wait(() => {
        let contents = this.getNoderized();

        //-- Remove last character.
        contents.splice(-1, 1);

        //-- Convert each node object into string representation,
        //-- grouping them before reprinting.
        contents = groupNodeStringContents(contents);

        this.setContents(contents.join(""));

        /**
         * If it's specified, keep deleting until all characters are gone. This is
         * the only time when a SINGLE queue action (`delete()`) deals with multiple
         * characters at once. I don't like it, but need to implement like this right now.
         */
        if (keepGoingUntilAllIsGone && contents.length > 0) {
          return this.delete(true).then(() => {
            return resolve();
          });
        }

        return resolve();
      }, this.deletePace);
    });
  }

  /**
   * QUEUEABLE
   */
  setOptions(options) {
    return new Promise(resolve => {
      this.opts = merge({}, this.opts, options);
      return resolve();
    });
  }
}
