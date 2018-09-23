import "./defaults.js";
import {
  isVisible,
  groupHTMLTags,
  randomInRange,
  removeComments,
  startsWith,
  toArray,
  appendStyleBlock
} from "./utilities";

export default class Instance {
  constructor(element, id, options, autoInit, typeit) {
    this.id = id;
    this.typeit = typeit;
    this.autoInit = autoInit;
    this.element = element;
    this.timeouts = [];
    this.hasStarted = false;
    this.isFrozen = false;
    this.isComplete = false;
    this.hasBeenDestroyed = false;
    this.queue = [];
    this.isInTag = false;
    this.stringsToDelete = "";
    this.inlineStyles = {
      base:
        "display:inline;position:relative;font:inherit;color:inherit;line-height:inherit;"
    };
    this.setOptions(options, window.TypeItDefaults, false);
    this.prepareTargetElement();
    this.prepareDelay("nextStringDelay");
    this.prepareDelay("loopDelay");
    this.prepareDOM();
    this.prepareStrings();

    if (this.options.startDelete && this.stringsToDelete) {
      this.insert(this.stringsToDelete);
      this.queue.push([this.delete]);
      this.insertSplitPause(1);
    }

    this.generateQueue();

    //-- We have no strings! So, don't do anything.
    if (!this.options.strings.length || !this.options.strings[0]) return;

    if (this.autoInit) {
      this.init();
    }
  }

  /**
   * Prepares strings for processing.
   */
  prepareStrings() {
    this.options.strings = removeComments(toArray(this.options.strings));
  }

  /**
   * Performs DOM-related work to prepare for typing.
   */
  prepareDOM() {
    this.element.innerHTML = `
      <span style="${this.inlineStyles.base}" class="ti-wrapper">
        <span style="${this.inlineStyles.base}" class="ti-container"></span>
      </span>
      `;
    this.element.setAttribute("data-typeitid", this.id);
    this.elementContainer = this.element.querySelector(".ti-container");
    this.elementWrapper = this.element.querySelector(".ti-wrapper");

    appendStyleBlock(
      `
        .${this.elementContainer.className}:before {
          content: '.';
          display: inline-block;
          width: 0;
          visibility: hidden;
        }
      `
    );
  }

  /**
   * Reset the instance to new status.
   */
  reset() {
    return new Instance(
      this.element,
      this.id,
      this.options,
      this.autoInit,
      this.typeit
    );
  }

  /**
   * If argument is passed, set to content according to `html` option.
   * If not, just return the contents of the element, based on `html` option.
   * @param {string | null} content
   */
  contents(content = null) {
    //-- Just return the contents of the element.
    if (content === null) {
      return this.options.html
        ? this.elementContainer.innerHTML
        : this.elementContainer.innerText;
    }

    this.elementContainer[
      this.options.html ? "innerHTML" : "innerText"
    ] = content;

    return content;
  }

  prepareDelay(delayType) {
    let delay = this.options[delayType];

    if (!delay) return;

    let isArray = Array.isArray(delay);
    let halfDelay = !isArray ? delay / 2 : null;

    this.options[delayType] = {
      before: isArray ? delay[0] : halfDelay,
      after: isArray ? delay[1] : halfDelay,
      total: isArray ? delay[0] + delay[1] : delay
    };
  }

  generateQueue(initialStep = null) {
    initialStep =
      initialStep === null
        ? [this.pause, this.options.startDelay]
        : initialStep;

    this.queue.push(initialStep);

    this.options.strings.forEach((string, index) => {
      this.queueString(string);

      //-- This is the last string. Get outta here.
      if (index + 1 === this.options.strings.length) return;

      if (this.options.breakLines) {
        this.queue.push([this.break]);
        this.insertSplitPause(this.queue.length);
        return;
      }

      this.queueDeletions(string);
      this.insertSplitPause(this.queue.length, string.length);
    });
  }

  /**
   * Delete each character from a string.
   */
  queueDeletions(stringOrNumber = null) {
    let number =
      typeof stringOrNumber === "string"
        ? stringOrNumber.length
        : stringOrNumber;

    for (let i = 0; i < number; i++) {
      this.queue.push([this.delete, 1]);
    }
  }

  /**
   * Add steps to the queue for each character in a given string.
   */
  queueString(string, rake = true) {
    if (!string) return;

    string = toArray(string);

    let doc = document.implementation.createHTMLDocument("");
    doc.body.innerHTML = string;

    //-- If it's designated, rake that bad boy for HTML tags and stuff.
    if (rake) {
      string = this.rake(string)[0];
    }

    //-- @todo Improve this check by using regex (rather than startsWith() checks).
    //-- If an opening HTML tag is found and we're not already printing inside a tag
    if (
      this.options.html &&
      (startsWith(string[0], "<") && !startsWith(string[0], "</"))
    ) {
      //-- Create node of that string name, by regexing for the closing tag.
      let matches = string[0].match(/\<(.*?)\>/);
      let doc = document.implementation.createHTMLDocument("");
      doc.body.innerHTML = "<" + matches[1] + "></" + matches[1] + ">";

      //-- Add to the queue.
      this.queue.push([this.type, doc.body.children[0]]);
    } else {
      this.queue.push([this.type, string[0]]);
    }

    //-- Shorten it by one character.
    string.splice(0, 1);

    //-- If rake is true, this is the first time we've queued this string.
    if (rake) {
      this.queue[this.queue.length - 1].push("first-of-string");
    }

    //-- If there's more to it, run again until fully printed.
    if (string.length) {
      this.queueString(string, false);
      return;
    }

    //-- End of string!
    this.queue[this.queue.length - 1].push("last-of-string");
  }

  /**
   * Insert a split pause around a range of queue items.
   *
   * @param  {Number} startPosition The position at which to start wrapping.
   * @param  {Number} numberOfActionsToWrap The number of actions in the queue to wrap.
   * @return {void}
   */
  insertSplitPause(startPosition, numberOfActionsToWrap = 1) {
    this.queue.splice(startPosition, 0, [
      this.pause,
      this.options.nextStringDelay.before
    ]);
    this.queue.splice(startPosition - numberOfActionsToWrap, 0, [
      this.pause,
      this.options.nextStringDelay.after
    ]);
  }

  init() {
    if (this.hasStarted) return;

    this.cursor();

    if (this.options.autoStart) {
      this.hasStarted = true;
      this.next();
      return;
    }

    if (isVisible(this.element)) {
      this.hasStarted = true;
      this.next();
      return;
    }

    let that = this;

    function checkForStart(event) {
      if (isVisible(that.element) && !that.hasStarted) {
        that.hasStarted = true;
        that.next();
        event.currentTarget.removeEventListener(event.type, checkForStart);
      }
    }

    window.addEventListener("scroll", checkForStart);
  }

  cursor() {
    let visibilityStyle = "visibility: hidden;";

    if (this.options.cursor) {
      appendStyleBlock(
        `
        @keyframes blink-${this.id} {
          0% {opacity: 0}
          49% {opacity: 0}
          50% {opacity: 1}
        }

        [data-typeitid='${this.id}'] .ti-cursor {
          animation: blink-${this.id} ${this.options.cursorSpeed /
          1000}s infinite;
        }
      `,
        this.id
      );

      visibilityStyle = "";
    }

    this.elementWrapper.insertAdjacentHTML(
      "beforeend",
      `<span style="${
        this.inlineStyles.base
      }${visibilityStyle}left: -.25ch;" class="ti-cursor">${
        this.options.cursorChar
      }</span>`
    );
  }

  /**
   * Inserts string to element container.
   */
  insert(content, toChildNode = false) {
    if (toChildNode) {
      this.elementContainer.lastChild.insertAdjacentHTML("beforeend", content);
    } else {
      this.elementContainer.insertAdjacentHTML("beforeend", content);
    }

    this.contents(
      this.contents()
        .split("")
        .join("")
    );
  }

  /**
   * Depending on if we're starting by deleting an existing string or typing
   * from nothing, set a specific variable to what's in the HTML.
   */
  prepareTargetElement() {
    //-- If any of the existing children nodes have .ti-container, clear it out because this is a remnant of a previous instance.
    [].slice.call(this.element.childNodes).forEach(node => {
      if (node.classList === undefined) return;

      if (node.classList.contains("ti-container")) {
        this.element.innerHTML = "";
      }
    });

    //-- Set the hard-coded string as the string(s) we'll type.
    if (!this.options.startDelete && this.element.innerHTML.length > 0) {
      this.options.strings = this.element.innerHTML.trim();
      return;
    }

    this.stringsToDelete = this.element.innerHTML;
  }

  break() {
    this.insert("<br>");
    this.next();
  }

  pause(time = false) {
    setTimeout(() => {
      this.next();
    }, time ? time : this.options.nextStringDelay.total);
  }

  /*
    Convert each string in the array to a sub-array. While happening, search the subarrays for HTML tags.
    When a complete tag is found, slice the subarray to get the complete tag, insert it at the correct index,
    and delete the range of indexes where the indexed tag used to be.
  */
  rake(array) {
    return array.map(item => {
      //-- Convert string to array.
      item = item.split("");

      //-- If we're parsing HTML, group tags into their own array items.
      if (this.options.html) {
        return groupHTMLTags(item);
      }

      return item;
    });
  }

  type(character) {
    this.setPace();

    this.timeouts[0] = setTimeout(() => {
      //-- We must have an HTML tag!
      if (typeof character !== "string") {
        character.innerHTML = "";
        this.elementContainer.appendChild(character);
        this.isInTag = true;
        this.next();
        return;
      }

      //-- When we hit the end of the tag, turn it off!
      if (startsWith(character, "</")) {
        this.isInTag = false;
        this.next();
        return;
      }

      this.insert(character, this.isInTag);

      this.next();
    }, this.typePace);
  }

  setOptions(settings, defaults = null, autonext = true) {
    let mergedSettings = {};

    if (defaults === null) {
      defaults = this.options;
    }

    for (let attrname in defaults) {
      mergedSettings[attrname] = defaults[attrname];
    }

    for (let attrname in settings) {
      mergedSettings[attrname] = settings[attrname];
    }

    this.options = mergedSettings;

    if (autonext) {
      this.next();
    }
  }

  setPace() {
    let typeSpeed = this.options.speed;
    let deleteSpeed =
      this.options.deleteSpeed !== null
        ? this.options.deleteSpeed
        : this.options.speed / 3;
    let typeRange = typeSpeed / 2;
    let deleteRange = deleteSpeed / 2;

    this.typePace = this.options.lifeLike
      ? randomInRange(typeSpeed, typeRange)
      : typeSpeed;
    this.deletePace = this.options.lifeLike
      ? randomInRange(deleteSpeed, deleteRange)
      : deleteSpeed;
  }

  delete(chars = null) {
    this.timeouts[1] = setTimeout(() => {
      this.setPace();

      let textArray = this.contents().split("");

      //-- Cut the array by a character.
      for (let n = textArray.length - 1; n > -1; n--) {
        if (
          (textArray[n] === ">" || textArray[n] === ";") &&
          this.options.html
        ) {
          for (let o = n; o > -1; o--) {
            if (textArray.slice(o - 3, o + 1).join("") === "<br>") {
              textArray.splice(o - 3, 4);
              break;
            }

            if (textArray[o] === "&") {
              textArray.splice(o, n - o + 1);
              break;
            }

            if (textArray[o] === "<") {
              if (textArray[o - 1] !== ">") {
                if (textArray[o - 1] === ";") {
                  for (var p = o - 1; p > -1; p--) {
                    if (textArray[p] === "&") {
                      textArray.splice(p, o - p);
                      break;
                    }
                  }
                }

                textArray.splice(o - 1, 1);
                break;
              }
            }
          }
          break;
        } else {
          textArray.pop();
          break;
        }
      }

      //-- If we've found an empty set of HTML tags...
      if (this.options.html && this.contents().indexOf("></") > -1) {
        for (let i = this.contents().indexOf("></") - 2; i >= 0; i--) {
          if (textArray[i] === "<") {
            textArray.splice(i, textArray.length - i);
            break;
          }
        }
      }

      //-- Make the content a string again, AND strip out any empty HTML tags.
      //-- We want do strip empty tags here and ONLY here because when we're
      //-- typing new content inside an HTML tag, there is momentarily an empty
      //-- tag we want to keep.
      this.contents(textArray.join("").replace(/<[^\/>][^>]*><\/[^>]+>/, ""));

      //-- Delete again! Don't call directly, to respect possible pauses.
      if (chars === null) {
        this.queue.unshift([this.delete, textArray.length]);
      }

      if (chars > 1) {
        this.queue.unshift([this.delete, chars - 1]);
      }

      this.next();
    }, this.deletePace);
  }

  /*
  * Empty the existing text, clearing it instantly.
  */
  empty() {
    this.contents("");
    this.next();
  }

  next() {
    if (this.isFrozen) {
      return;
    }

    //-- We haven't reached the end of the queue, go again.
    if (this.queue.length > 0) {
      this.step = this.queue.shift();

      if (this.step[2] === "first-of-string" && this.options.beforeString) {
        this.options.beforeString(this.step, this.queue, this.typeit);
      }

      if (this.options.beforeStep) {
        this.options.beforeStep(this.step, this.queue, this.typeit);
      }

      //-- Execute this step!
      this.step[0].call(this, this.step[1], this.step[2]);

      if (this.step[2] === "last-of-string" && this.options.afterString) {
        this.options.afterString(this.step, this.queue, this.typeit);
      }

      if (this.options.afterStep) {
        this.options.afterStep(this.step, this.queue, this.typeit);
      }

      return;
    }

    //-- @todo: Remove in next major release.
    if (this.options.callback) {
      this.options.callback();
    }

    if (this.options.afterComplete) {
      this.options.afterComplete(this.typeit);
    }

    if (this.options.loop) {
      let delay = this.options.loopDelay
        ? this.options.loopDelay
        : this.options.nextStringDelay;
      this.queueDeletions(this.contents());
      this.generateQueue([this.pause, delay.before]);

      setTimeout(() => {
        this.next();
      }, delay.after);

      return;
    }

    this.isComplete = true;
  }
}
