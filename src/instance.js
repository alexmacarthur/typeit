import "./defaults.js";

export default class Instance {
  constructor(element, id, options) {
    this.timeouts = [];
    this.id = id;
    this.queue = [];
    this.hasStarted = false;
    this.isFrozen = false;
    this.isComplete = false;
    this.isInTag = false;
    this.stringsToDelete = "";
    this.style = "display:inline;position:relative;font:inherit;color:inherit;";
    this.element = element;
    this.setOptions(options, window.TypeItDefaults, false);
    this.setNextStringDelay();
    this.init();
  }

  /**
   * Based on options, set the before and after values for the delay that is inserted when typing new strings.
   */
  setNextStringDelay() {
    let isArray = Array.isArray(this.options.nextStringDelay);

    let halfDelay = !isArray ? this.options.nextStringDelay / 2 : null;

    this.options.nextStringDelay = {
      before: isArray ? this.options.nextStringDelay[0] : halfDelay,
      after: isArray ? this.options.nextStringDelay[1] : halfDelay,
      total: isArray
        ? this.options.nextStringDelay.reduce((accumulator, currentValue) => {
            return accumulator + currentValue;
          })
        : this.options.nextStringDelay
    };
  }

  init() {
    this.checkElement();

    this.options.strings = this.toArray(this.options.strings);
    this.options.strings = this.removeComments(this.options.strings);

    //-- We don't have anything. Get out of here.
    if (this.options.strings.length >= 1 && this.options.strings[0] === "") {
      return;
    }

    this.element.innerHTML = `
        <span style="${this.style}" class="ti-container"></span>
      `;

    this.element.setAttribute("data-typeitid", this.id);
    this.elementContainer = this.element.querySelector("span");

    if (this.options.startDelete) {
      this.insert(this.stringsToDelete);
      this.queue.push([this.delete]);
      this.insertSplitPause(1);
    }

    this.cursor();
    this.generateQueue();
    this.kickoff();
  }

  removeComments(arrayOfStrings) {
    return arrayOfStrings.map(string => {
      return string.replace(/<\!--.*?-->/g, "");
    });
  }

  generateQueue(initialStep = null) {
    initialStep =
      initialStep === null
        ? [this.pause, this.options.startDelay]
        : initialStep;

    this.queue.push(initialStep);

    this.options.strings.forEach((string, index) => {
      this.queueUpString(string);

      //-- This is not the last string,so insert a pause for between strings.
      if (index + 1 < this.options.strings.length) {
        if (this.options.breakLines) {
          this.queue.push([this.break]);
          this.insertSplitPause(this.queue.length);
        } else {
          this.queueUpDeletions(string);
          this.insertSplitPause(this.queue.length, string.length);
        }
      }
    });
  }

  /**
   * Delete each character from a string.
   */
  queueUpDeletions(stringOrNumber = null) {
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
  queueUpString(string, rake = true) {
    if (!string) return;

    string = this.toArray(string);

    var doc = document.implementation.createHTMLDocument();
    doc.body.innerHTML = string;

    //-- If it's designated, rake that bad boy for HTML tags and stuff.
    if (rake) {
      string = this.rake(string);
      string = string[0];
    }

    //-- If an opening HTML tag is found and we're not already printing inside a tag
    if (
      this.options.html &&
      (string[0].startsWith("<") && !string[0].startsWith("</"))
    ) {
      //-- Create node of that string name.
      let matches = string[0].match(/\<(.*?)\>/);
      let doc = document.implementation.createHTMLDocument();
      doc.body.innerHTML = "<" + matches[1] + "></" + matches[1] + ">";

      //-- Add to the queue.
      this.queue.push([this.type, doc.body.children[0]]);
    } else {
      this.queue.push([this.type, string[0]]);
    }

    //-- Shorten it by one character.
    string.splice(0, 1);

    //-- If there's more to it, run again until fully printed.
    if (string.length) {
      this.queueUpString(string, false);
    }
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

  kickoff() {
    if (this.options.autoStart) {
      this.hasStarted = true;
      this.next();
      return;
    }

    if (this.isVisible()) {
      this.hasStarted = true;
      this.next();
      return;
    }

    let that = this;

    window.addEventListener("scroll", function checkForStart(event) {
      if (that.isVisible() && !that.hasStarted) {
        that.hasStarted = true;
        that.next();
        event.currentTarget.removeEventListener(event.type, checkForStart);
      }
    });
  }

  isVisible() {
    let coordinates = this.element.getBoundingClientRect();

    let viewport = {
      height:
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight,
      width:
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth
    };

    //-- Element extends outside of viewport.
    if (
      coordinates.right > viewport.width ||
      coordinates.bottom > viewport.height
    ) {
      return false;
    }

    //-- Top or left aren't visible.
    if (coordinates.top < 0 || coordinates.left < 0) {
      return false;
    }

    return true;
  }

  cursor() {
    let visibilityStyle = "visibility: hidden;";

    if (this.options.cursor) {
      let styleBlock = document.createElement("style");

      styleBlock.id = this.id;

      let styles = `
            @keyframes blink-${this.id} {
              0% {opacity: 0}
              49% {opacity: 0}
              50% {opacity: 1}
            }

            [data-typeitid='${this.id}'] .ti-cursor {
              animation: blink-${this.id} ${this.options.cursorSpeed /
        1000}s infinite;
            }
          `;

      styleBlock.appendChild(document.createTextNode(styles));

      document.head.appendChild(styleBlock);

      visibilityStyle = "";
    }

    this.element.insertAdjacentHTML(
      "beforeend",
      `<span style="${this.style}${visibilityStyle}" class="ti-cursor">${
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

    //-- Split & rejoin to avoid odd spacing issues in some browsers.
    this.elementContainer.innerHTML = this.elementContainer.innerHTML
      .split("")
      .join("");
  }

  /**
   * Converts a string to an array, if it's not already.
   *
   * @return array
   */
  toArray(string) {
    return string.constructor === Array
      ? string.slice(0)
      : string.split("<br>");
  }

  /**
   * Depending on if we're starting by deleting an existing string or typing
   * from nothing, set a specific variable to what's in the HTML.
   */
  checkElement() {
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

  pause(time = null) {
    setTimeout(() => {
      this.next();
    }, time === null ? this.options.nextStringDelay.total : time);
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
        let tPosition = [];
        let tag;
        let isEntity = false;

        for (let j = 0; j < item.length; j++) {
          if (item[j] === "<" || item[j] === "&") {
            tPosition[0] = j;
            isEntity = item[j] === "&";
          }

          if (item[j] === ">" || (item[j] === ";" && isEntity)) {
            tPosition[1] = j;
            j = 0;
            tag = item.slice(tPosition[0], tPosition[1] + 1).join("");
            item.splice(tPosition[0], tPosition[1] - tPosition[0] + 1, tag);
            isEntity = false;
          }
        }
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
      if (character.startsWith("</")) {
        this.isInTag = false;
        this.next();
        return;
      }

      this.insert(character, this.isInTag);

      this.next();
    }, this.typePace);
  }

  /**
   * Removes helper elements with certain classes from the TypeIt element.
   */
  removeHelperElements() {
    let helperElements = this.element.querySelectorAll(
      ".ti-container, .ti-cursor"
    );

    [].forEach.call(helperElements, helperElement => {
      this.element.removeChild(helperElement);
    });
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

  randomInRange(value, range) {
    return Math.abs(
      Math.random() * (value + range - (value - range)) + (value - range)
    );
  }

  setPace() {
    let typeSpeed = this.options.speed;
    let deleteSpeed =
      this.options.deleteSpeed !== undefined
        ? this.options.deleteSpeed
        : this.options.speed / 3;
    let typeRange = typeSpeed / 2;
    let deleteRange = deleteSpeed / 2;

    this.typePace = this.options.lifeLike
      ? this.randomInRange(typeSpeed, typeRange)
      : typeSpeed;
    this.deletePace = this.options.lifeLike
      ? this.randomInRange(deleteSpeed, deleteRange)
      : deleteSpeed;
  }

  delete(chars = null) {
    this.timeouts[1] = setTimeout(() => {
      this.setPace();

      let textArray = this.elementContainer.innerHTML.split("");

      let amount = chars + 1;

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
      if (this.elementContainer.innerHTML.indexOf("></") > -1) {
        for (
          let i = this.elementContainer.innerHTML.indexOf("></") - 2;
          i >= 0;
          i--
        ) {
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
      this.elementContainer.innerHTML = textArray
        .join("")
        .replace(/<[^\/>][^>]*><\/[^>]+>/, "");

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
    Empty the existing text, clearing it instantly.
  */
  empty() {
    this.elementContainer.innerHTML = "";
    this.next();
  }

  next() {
    if (this.isFrozen) {
      return;
    }

    //-- We haven't reached the end of the queue, go again.
    if (this.queue.length > 0) {
      let thisStep = this.queue[0];
      this.queue.shift();
      thisStep[0].call(this, thisStep[1]);
      return;
    }

    this.options.callback();

    if (this.options.loop) {
      this.queueUpDeletions(this.elementContainer.innerHTML);
      this.generateQueue([this.pause, this.options.loopDelay / 2]);

      setTimeout(() => {
        this.next();
      }, this.options.loopDelay / 2);
    } else {
      this.isComplete = true;
    }
  }
}
