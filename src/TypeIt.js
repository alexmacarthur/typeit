import defaults from "./defaults.js";
import Queue from "./Queue";
import {
  chunkStringAsHtml,
  maybeChunkStringAsHtml,
  createCharacterObject
} from "./helpers/chunkStrings";
import appendStyleBlock from "./helpers/appendStyleBlock";
import asArray from "./helpers/asArray";
import calculateDelay from "./helpers/calculateDelay.js";
import calculatePace from "./helpers/calculatePace.js";
import createElement from "./helpers/createElement";
import destroyTimeouts from "./helpers/destroyTimeouts";
import fireWhenVisible from "./helpers/fireWhenVisible";
import getAllTypeableNodes from "./helpers/getAllTypeableNodes.js";
import getParsedBody from "./helpers/getParsedBody.js";
import insertIntoElement from "./helpers/insertIntoElement";
import isArray from "./helpers/isArray";
import isInput from "./helpers/isInput";
import merge from "./helpers/merge";
import queueMany from "./helpers/queueMany";
import removeNode from "./helpers/removeNode";
import removeComments from "./helpers/removeComments";
import removeEmptyElements from "./helpers/removeEmptyElements";
import repositionCursor from "./helpers/repositionCursor";
import selectorToElement from "./helpers/selectorToElement";
import toArray from "./helpers/toArray";
import generateHash from "./helpers/generateHash.js";
import processCursorMovementArg from "./helpers/processCursorMovementArg.js";
import getStyleString from "./helpers/getStyleString.js";

export default function TypeIt(element, options) {
  options = options || {};

  const _maybeAppendPause = opts => {
    opts = opts || {};
    let delay = opts.delay;
    delay && _queue.add([_pause, delay]);
  };

  const _queueAndReturn = (stepOrSteps, numberOfTimes, opts) => {
    stepOrSteps = isArray(stepOrSteps[0]) ? stepOrSteps : [stepOrSteps];
    _queue.add(stepOrSteps, numberOfTimes);
    _maybeAppendPause(opts);
    return this;
  };

  const _generateTemporaryOptionQueueItems = newOptions => {
    newOptions = typeof newOptions === "object" ? newOptions : {};

    return [
      [_options, newOptions, { force: true }],
      [_options, _opts, { force: true }]
    ];
  };

  /**
   * Get a flattened array of text nodes that have been typed.
   * This excludes any cursor character that might exist.
   *
   * @return {array}
   */
  const _getAllChars = () => {
    if (_elementIsInput) {
      return toArray(_element.value);
    }

    return getAllTypeableNodes(_element, _cursor, true);
  };

  /**
   * Insert a split pause around a range of queue items.
   *
   * @param  {Number} startPosition The array position at which to start wrapping.
   * @param  {Number} numberOfActionsToWrap The number of actions in the queue to wrap.
   * @return {void}
   */
  const _addSplitPause = (startPosition, numberOfActionsToWrap) => {
    numberOfActionsToWrap = numberOfActionsToWrap || 1;
    let delay = _opts.nextStringDelay;
    _queue.insert(startPosition, [_pause, delay.before]);
    _queue.insert(startPosition + numberOfActionsToWrap + 1, [
      _pause,
      delay.after
    ]);
  };

  /**
   * Provided it's a non-form element and the options is provided,
   * set up the cursor element for the
   *
   * @return {void}
   */
  const _setUpCursor = () => {
    if (_elementIsInput || !_opts.cursor) {
      return null;
    }

    // If we have a cursor node from a previous instance (prior to a reset()),
    // there's no need to recreate one now.
    let cursor = createElement("span");
    cursor.innerHTML = getParsedBody(_opts.cursorChar).innerHTML;
    cursor.className = "ti-cursor";
    cursor.style.cssText = `display:inline;${getStyleString(_element)}`;

    return cursor;
  };

  /**
   * If a cursor node's been generated, attach it to the DOM so
   * it appears for the user, along with the required CSS transition.
   *
   * @return void
   */
  const _maybeAttachCursor = async () => {
    if (!_cursor) {
      return;
    }

    let selector = `[data-typeit-id='${_id}'] .ti-cursor`;

    appendStyleBlock(
      `@keyframes blink-${_id} { 0% {opacity: 0} 49% {opacity: 0} 50% {opacity: 1} } ${selector} { animation: blink-${_id} ${_opts.cursorSpeed /
        1000}s infinite; } ${selector}.with-delay { animation-delay: 500ms; } ${selector}.disabled { animation: none; }`,
      _id
    );

    _element.appendChild(_cursor);

    await document.fonts.ready;

    let calculatedMargin = _cursor.getBoundingClientRect().width / 2;

    _cursor.style.margin = `0 -${calculatedMargin + 1}px 0 -${calculatedMargin -
      1}px`;
  };

  const _disableCursorBlink = shouldDisable => {
    if (!_cursor) {
      return;
    }

    _cursor.classList.toggle("disabled", shouldDisable);
    _cursor.classList.toggle("with-delay", !shouldDisable);
  };

  /**
   * Fire a callback after a delay, adding the created timeout
   * to the `timeouts` instance property.
   *
   * @param {object} callback
   * @param {integer} delay
   */
  const _wait = async (callback, delay) => {
    _timeouts.push(setTimeout(callback, delay));
  };

  /**
   * Based on provided strings, generate a TypeIt queue
   * to be fired for each character in the string.
   *
   * @param {array|null} initialStep
   */
  const _generateQueue = () => {
    let strings = _opts.strings;

    strings.forEach((string, index) => {
      let chunkedString = maybeChunkStringAsHtml(string, _opts.html);

      _queue.add(queueMany(chunkedString, _type, _freezeCursorMeta, true));

      let queueLength = _queue.getItems().length;

      // This is the last string. Get outta here.
      if (index + 1 === strings.length) {
        return;
      }

      if (_opts.breakLines) {
        let breakObj = createCharacterObject(createElement("BR"));
        _queue.add([_type, breakObj, _freezeCursorMeta]);
        _addSplitPause(queueLength);
        return;
      }

      _queue.add(queueMany(chunkedString, _delete, _freezeCursorMeta));
      _addSplitPause(queueLength, string.length);
    });
  };

  /**
   * 1. Reset queue.
   * 2. Remove initial pause.
   * 3. Add phantom deletions.
   */
  const _loopify = async delay => {
    // Reset queue.
    // Remove initial pause, so we can replace with `loop` pause.
    // Add delay pause FIRST, since we're adding to beginning of queue.

    // Reset the cursor position!
    if (_cursorPosition) {
      await _move(_cursorPosition);
    }

    _queue
      .reset()
      .delete(0)
      .add([_pause, delay.before], true);

    // Queue the current number of printed items for deletion.
    _getAllChars().forEach(i => {
      _queue.add([_delete, null, { isPhantom: true }], 1, true);
    });
  };

  const _maybePrependHardcodedStrings = strings => {
    let existingMarkup = removeComments(_element);

    if (!existingMarkup) {
      return strings;
    }

    // Once we've saved the existing markup to a variable,
    // wipe the element clean to prepare for typing.
    _element.innerHTML = "";

    if (_opts.startDelete) {
      chunkStringAsHtml(existingMarkup).forEach(item => {
        insertIntoElement(_element, item, _cursor, _cursorPosition);
      });

      _queue.add([_delete, true]);
      _addSplitPause(1);
      return strings;
    }

    return [existingMarkup.trim()].concat(strings);
  };

  const _fire = async () => {
    _statuses.started = true;

    let queueItems = _queue.getItems();

    try {
      for (let i = 0; i < queueItems.length; i++) {
        if (_statuses.frozen || _statuses.destroyed) {
          throw "";
        }

        let queueAction = queueItems[i];
        let queueActionMeta = queueAction[2];
        let callbackArgs = [queueAction, this];

        queueActionMeta.freezeCursor && _disableCursorBlink(true);

        _pace = calculatePace(_opts.speed, _opts.deleteSpeed, _opts.lifeLike);

        if (queueActionMeta?.isFirst) {
          await _opts.beforeString(...callbackArgs);
        }

        await _opts.beforeStep(...callbackArgs);

        // Fire this step! During this process, pluck items from the waiting
        // queue and move them to executed.
        await queueAction[0].call(this, queueAction[1], queueActionMeta);

        // If this is a phantom item, as soon as it's executed,
        // remove it from the queue and pretend it never existed.
        if (!queueActionMeta || !queueActionMeta.isPhantom) {
          if (queueAction[2]?.isLast) {
            await _opts.afterString(...callbackArgs);
          }

          await _opts.afterStep(...callbackArgs);

          queueAction[2].executed = true;
        }

        _disableCursorBlink(false);
      }

      _statuses.completed = true;
      await _opts.afterComplete(this);

      if (_opts.loop) {
        let delay = _opts.loopDelay;

        _wait(async () => {
          await _loopify(delay);
          _fire();
        }, delay.after);
      }
    } catch (e) {}

    return this;
  };

  const _pause = time => {
    return new Promise(resolve => {
      _wait(() => {
        return resolve();
      }, time || 0);
    });
  };

  /**
   * Move type cursor by a given number.
   *
   * @param {integer} movementArg
   */
  const _move = movementArg => {
    let allChars = _getAllChars();
    let arg = processCursorMovementArg(movementArg, _cursorPosition, allChars);

    _cursorPosition += arg.numberOfSteps;

    return new Promise(resolve => {
      _wait(async () => {
        repositionCursor(_element, _getAllChars(), _cursor, _cursorPosition);

        /**
         * If our argument is a sting, we're moving absolutely and need to keep
         * going until there are no more spaces to move.
         */
        if (arg.isString && arg.canKeepMoving) {
          await _move(arg.numberOfSteps > 0 ? "START" : "END");
        }

        return resolve();
      }, _pace[0]);
    });
  };

  const _type = characterObject => {
    return new Promise(resolve => {
      _wait(() => {
        insertIntoElement(_element, characterObject, _cursor, _cursorPosition);
        return resolve();
      }, _pace[0]);
    });
  };

  const _options = async opts => {
    _opts = merge(_opts, opts);
    return;
  };

  const _empty = async () => {
    if (_elementIsInput) {
      _element.value = "";
      return;
    }

    _getAllChars().forEach(n => {
      removeNode(n);
    });

    return;
  };

  const _delete = keepGoingUntilAllIsGone => {
    keepGoingUntilAllIsGone = keepGoingUntilAllIsGone === true;

    return new Promise(resolve => {
      _wait(async () => {
        let allChars = _getAllChars();

        if (allChars.length) {
          if (_elementIsInput) {
            _element.value = _element.value.slice(0, -1);
          } else {
            removeNode(allChars[_cursorPosition]);
          }
        }

        removeEmptyElements(_element);

        /**
         * If it's specified, keep deleting until all characters are gone. This is
         * the only time when a SINGLE queue action (`delete()`) deals with multiple
         * characters at once. I don't like it, but need to implement like this right now.
         */
        if (keepGoingUntilAllIsGone && allChars.length - 1 > 0) {
          await _delete(true);
          return resolve();
        }

        return resolve();
      }, _pace[1]);
    });
  };

  this.break = function(actionOpts) {
    return _queueAndReturn(
      [_type, createCharacterObject(createElement("BR"))],
      1,
      actionOpts
    );
  };

  this.delete = function(numCharacters, actionOpts) {
    let bookEndQueueItems = _generateTemporaryOptionQueueItems(actionOpts);

    _queue.add(bookEndQueueItems[0]);
    _queue.add(
      [_delete, !numCharacters, _freezeCursorMeta], // Maybe delete all.
      numCharacters || 1
    );
    _queue.add(bookEndQueueItems[1]);

    _maybeAppendPause(actionOpts);

    return this;
  };

  this.empty = function() {
    return _queueAndReturn(_empty, 1, arguments);
  };

  this.exec = function(func, actionOpts) {
    let bookEndQueueItems = _generateTemporaryOptionQueueItems(actionOpts);
    return _queueAndReturn(
      [bookEndQueueItems[0], [func, null], bookEndQueueItems[1]],
      1,
      actionOpts
    );
  };

  this.move = function(movementArg, actionOpts) {
    let arg = processCursorMovementArg(
      movementArg,
      _cursorPosition,
      _getAllChars()
    );

    let bookEndQueueItems = _generateTemporaryOptionQueueItems(actionOpts);

    _queue.add(bookEndQueueItems[0]);
    _queue.add(
      [
        _move,

        // Direction is set by the +/- of the argument.
        arg.isString ? movementArg : Math.sign(movementArg),

        _freezeCursorMeta
      ],

      // number of times to queue this same action.
      Math.abs(movementArg)
    );
    _queue.add(bookEndQueueItems[1]);

    _maybeAppendPause(actionOpts);

    return this;
  };

  this.options = function(opts) {
    return _queueAndReturn([_options, opts], 1, opts);
  };

  this.pause = function(ms, actionOpts) {
    return _queueAndReturn([_pause, ms], 1, actionOpts);
  };

  this.type = function(string, actionOpts) {
    let bookEndQueueItems = _generateTemporaryOptionQueueItems(actionOpts);
    let chunkedString = maybeChunkStringAsHtml(string, _opts.html);

    let itemsToQueue = [
      bookEndQueueItems[0],
      ...queueMany(chunkedString, _type, _freezeCursorMeta, true),
      bookEndQueueItems[1]
    ];

    return _queueAndReturn(itemsToQueue, 1, actionOpts);
  };

  this.is = function(key) {
    return _statuses[key];
  };

  this.destroy = function(shouldRemoveCursor) {
    shouldRemoveCursor =
      shouldRemoveCursor === undefined ? true : shouldRemoveCursor;
    _timeouts = destroyTimeouts(_timeouts);
    shouldRemoveCursor && removeNode(_cursor);
    _statuses.destroyed = true;
  };

  this.freeze = function() {
    _statuses["frozen"] = true;
  };

  this.unfreeze = function() {
    _statuses["frozen"] = false;
    !_statuses["frozen"] && _fire();
  };

  this.reset = function() {
    !this.is("destroyed") && this.destroy();

    _queue.reset();

    for (let property in _statuses) {
      _statuses[property] = false;
    }

    return this;
  };

  this.go = function() {
    if (_statuses.started) {
      return this;
    }

    _maybeAttachCursor();

    if (!_opts.waitUntilVisible) {
      _fire();
      return this;
    }

    fireWhenVisible(_element, _fire.bind(this));

    return this;
  };

  this.getQueue = function() {
    return _queue;
  };

  this.getOptions = function() {
    return _opts;
  };

  this.getElement = function() {
    return _element;
  };

  let _element = selectorToElement(element);
  let _elementIsInput = isInput(_element);
  let _pace = [];
  let _timeouts = [];
  let _cursorPosition = 0;
  let _freezeCursorMeta = { freezeCursor: true };
  let _statuses = {
    started: false,
    completed: false,
    frozen: false,
    destroyed: false
  };

  let _opts = merge(defaults, options);
  _opts = merge(_opts, {
    html: _elementIsInput ? false : _opts.html,
    nextStringDelay: calculateDelay(_opts.nextStringDelay),
    loopDelay: calculateDelay(_opts.loopDelay)
  });

  let _id = generateHash();
  let _queue = new Queue([_pause, _opts.startDelay]);
  _element.setAttribute("data-typeit-id", _id);

  // Used to set a "placeholder" space in the element, so that it holds vertical sizing before anything's typed.
  appendStyleBlock(
    `[data-typeit-id]:before {content: '.'; display: inline-block; width: 0; visibility: hidden;}[data-typeit-id]`
  );

  _opts.strings = _maybePrependHardcodedStrings(asArray(_opts.strings));

  let _cursor = _setUpCursor();

  // Only generate a queue if we have strings
  // and this isn't a reset of a previous instance,
  // in which case we'd have a pre-defined queue.
  if (_opts.strings.length) {
    _generateQueue();
  }
}
