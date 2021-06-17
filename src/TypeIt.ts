import defaults from "./defaults";
import Queue from "./Queue";
import {
  chunkStringAsHtml,
  maybeChunkStringAsHtml,
  createCharacterObject,
} from "./helpers/chunkStrings";
import appendStyleBlock from "./helpers/appendStyleBlock";
import asArray from "./helpers/asArray";
import calculateDelay from "./helpers/calculateDelay";
import calculatePace from "./helpers/calculatePace";
import createElement from "./helpers/createElement";
import destroyTimeouts from "./helpers/destroyTimeouts";
import fireWhenVisible from "./helpers/fireWhenVisible";
import getAllTypeableNodes from "./helpers/getAllTypeableNodes";
import getParsedBody from "./helpers/getParsedBody";
import insertIntoElement from "./helpers/insertIntoElement";
import isInput from "./helpers/isInput";
import merge from "./helpers/merge";
import queueMany from "./helpers/queueMany";
import removeNode from "./helpers/removeNode";
import removeEmptyElements from "./helpers/removeEmptyElements";
import repositionCursor from "./helpers/repositionCursor";
import selectorToElement from "./helpers/selectorToElement";
import { setCursorStyles } from "./helpers/setCursorStyles";
import toArray from "./helpers/toArray";
import generateHash from "./helpers/generateHash";
import processCursorMovementArg from "./helpers/processCursorMovementArg";
import { Element, Options, QueueItem } from "./types";

export default function TypeIt(
  element: Element | string,
  options: Options = {}
): void {
  const _maybeAppendPause = (opts = {}) => {
    let delay = opts["delay"];
    delay && _queue.add([[_pause, delay]]);
  };

  const _queueAndReturn = (steps: QueueItem[], opts: Options) => {
    _queue.add(steps);
    _maybeAppendPause(opts);

    return this;
  };

  const _generateTemporaryOptionQueueItems = (
    newOptions: Options = {}
  ): QueueItem[] => {
    return [
      [_options, newOptions, { force: true }],
      [_options, _opts, { force: true }],
    ];
  };

  /**
   * Add items to the queue with a split pause
   * wrapped around them.
   */
  const _addSplitPause = (items: QueueItem[]) => {
    let delay = _opts.nextStringDelay;

    _queue.add([
      [_pause, delay[0]],
      ...items,
      [_pause, delay[1]],
    ])
  }

  /**
   * Get a flattened array of text nodes that have been typed.
   * This excludes any cursor character that might exist.
   *
   * @return {array}
   */
  const _getAllChars = () => {
    return _elementIsInput
      ? toArray(_element.value)
      : getAllTypeableNodes(_element, _cursor, true);
  };

  /**
   * Provided it's a non-form element and the options is provided,
   * set up the cursor element for the
   *
   * @return {void}
   */
  const _setUpCursor = (): undefined | Element => {
    if (_elementIsInput) {
      return;
    }

    // If we have a cursor node from a previous instance (prior to a reset()),
    // there's no need to recreate one now.
    let cursor = createElement("span");
    cursor.className = "ti-cursor";

    // Don't bother touching up the cursor if we don't want it to visibly render anyway.
    if (!_shouldRenderCursor) {
      cursor.style.visibility = 'hidden';

      return cursor as Element;
    }

    cursor.innerHTML = getParsedBody(_opts.cursorChar).innerHTML;

    return cursor as Element;
  };

  /**
   * Attach it to the DOM so, along with the required CSS transition.
   */
  const _attachCursor = async () => {
    !_elementIsInput && _element.appendChild(_cursor);

    if(!_shouldRenderCursor) {
      return;
    }

    setCursorStyles(_id, _opts, _element);

    (document as any).fonts.status === "loaded" ||
      (await (document as any).fonts.ready);

    // Guarantee that the text has been fully painted after font has loaded.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const calculatedMargin = _cursor.getBoundingClientRect().width / 2;

        _cursor.style.margin = `0 -${calculatedMargin + 2}px 0 -${calculatedMargin - 2}px`;
      });
    })
  };

  const _disableCursorBlink = (shouldDisable: boolean): void => {
    if (_shouldRenderCursor) {
      _cursor.classList.toggle("disabled", shouldDisable);
      _cursor.classList.toggle("with-delay", !shouldDisable);
    }
  };

  /**
   * Fire a callback after a delay, adding the created timeout
   * to the `timeouts` instance property.
   */
  const _wait = async (callback: Function, delay: number) => {
    return new Promise<void>((resolve) => {
      const cb = async () => {
        await callback();

        resolve();
      };

      _timeouts.push(setTimeout(cb, delay) as unknown as number);
    });
  };

  /**
   * Based on provided strings, generate a TypeIt queue
   * to be fired for each character in the string.
   */
  const _generateQueue = () => {
    let strings = _opts.strings.filter((string) => !!string);

    strings.forEach((string, index) => {
      let chunkedString = maybeChunkStringAsHtml(string, _opts.html);

      _queue.add(queueMany(chunkedString, _type, _freezeCursorMeta, true));

      // This is the last string. Get outta here.
      if (index + 1 === strings.length) {
        return;
      }

      if (_opts.breakLines) {
        _addSplitPause([[_type, createCharacterObject(createElement("BR")), _freezeCursorMeta]]);
        return;
      }

      _addSplitPause(queueMany(chunkedString, _delete, _freezeCursorMeta));
    });
  };

  /**
   * 1. Reset queue.
   * 2. Reset initial pause.
   */
  const _prepLoop = async (delay) => {
    _cursorPosition && (await _move(_cursorPosition));
    _queue.reset();
    _queue.set(0, [_pause, delay, {}]);

    await _delete(true);
  };

  const _maybePrependHardcodedStrings = (strings) => {
    let existingMarkup = _element.innerHTML;

    if (!existingMarkup) {
      return strings;
    }

    // Once we've saved the existing markup to a variable,
    // wipe the element clean to prepare for typing.
    _element.innerHTML = "";

    if (_opts.startDelete) {
      chunkStringAsHtml(existingMarkup).forEach((item) => {
        insertIntoElement(_element, item, _cursor, _cursorPosition);
      });

      _addSplitPause([[_delete, true]]);

      return strings;
    }

    return [existingMarkup.trim()].concat(strings);
  };

  const _fire = async (): Promise<void> => {
    _statuses.started = true;

    let queueItems = _queue.getItems();
    let callbackArgs;

    try {
      for (let i = 0; i < queueItems.length; i++) {
        if (_statuses.frozen || _statuses.destroyed) {
          throw "";
        }

        let queueAction = queueItems[i];
        let queueActionMeta = queueAction[2];
        callbackArgs = [queueAction, this];

        queueActionMeta.freezeCursor && _disableCursorBlink(true);

        _pace = calculatePace(_opts.speed, _opts.deleteSpeed, _opts.lifeLike);

        if (queueActionMeta?.isFirst) {
          await _opts.beforeString(...callbackArgs);
        }

        await _opts.beforeStep(...callbackArgs);

        // Fire this step!
        await queueAction[0].call(this, queueAction[1], queueActionMeta);

        if (queueAction[2]?.isLast) {
          await _opts.afterString(...callbackArgs);
        }

        await _opts.afterStep(...callbackArgs);

        _queue.setMeta(i, { executed: true });

        _disableCursorBlink(false);
      }

      _statuses.completed = true;

      await _opts.afterComplete(...callbackArgs);

      if (!_opts.loop) {
        throw "";
      }

      let delay = _opts.loopDelay;

      _wait(async () => {
        await _prepLoop(delay[0]);
        _fire();
      }, delay[1]);
    } catch (e) {}

    return this;
  };

  const _pause = (time = 0): Promise<void> => {
    return _wait(() => {}, time);
  };

  /**
   * Move type cursor by a given number.
   *
   * @param {integer} movementArg
   */
  const _move = (movementArg): Promise<void> => {
    let allChars = _getAllChars();
    let { numberOfSteps, isString, canKeepMoving } = processCursorMovementArg(movementArg, _cursorPosition, allChars);

    _cursorPosition += numberOfSteps;

    return _wait(async () => {
      repositionCursor(_element, _getAllChars(), _cursor, _cursorPosition);

      /**
       * If our argument is a string, we're moving absolutely and need to keep
       * going until there are no more spaces to move.
       */
      if (isString && canKeepMoving) {
        await _move(numberOfSteps > 0 ? "START" : "END");
      }
    }, _pace[0]);
  };

  const _type = (characterObject): Promise<void> => {
    return _wait(() => {
      insertIntoElement(_element, characterObject, _cursor, _cursorPosition);
    }, _pace[0]);
  };

  const _options = async (opts) => {
    _opts = merge(_opts, opts);
    return;
  };

  const _empty = async () => {
    if (_elementIsInput) {
      _element.value = "";
      return;
    }

    _getAllChars().forEach((n) => {
      removeNode(n);
    });

    return;
  };

  const _delete = (keepGoingUntilAllIsGone = false): Promise<void> => {
    return _wait(async () => {
      let allChars = _getAllChars();
      let charLength = allChars.length;

      if (!charLength) {
        return;
      }

      if (_elementIsInput) {
        _element.value = (_element.value as string).slice(0, -1);
      } else {
        removeNode(allChars[_cursorPosition]);
        removeEmptyElements(_element, _cursor);
      }

      /**
        * If it's specified, keep deleting until all characters are gone. This is
        * the only time when a SINGLE queue action (`delete()`) deals with multiple
        * characters at once. I don't like it, but need to implement like this right now.
        */
      if (keepGoingUntilAllIsGone && charLength - 1 > 0) {
        await _delete(true);
      }
    }, _pace[1]);
  };

  this.break = function (actionOpts) {
    return _queueAndReturn(
      [[_type, createCharacterObject(createElement("BR"))]],
      actionOpts
    );
  };

  this.delete = function (numCharacters, actionOpts) {
    let bookEndQueueItems = _generateTemporaryOptionQueueItems(actionOpts);

    return _queueAndReturn(
      [
        bookEndQueueItems[0],
        // Duplicate this queue item a certain number of times.
        ...([...Array(Math.abs(numCharacters) || 1)]
          .fill(null)
          .map(() => [
            _delete,
            !numCharacters,
            _freezeCursorMeta,
          ]) as QueueItem[]),
        bookEndQueueItems[1],
      ],
      actionOpts
    );
  };

  this.empty = function (actionOpts = {}) {
    return _queueAndReturn([[_empty]], actionOpts);
  };

  this.exec = function (func, actionOpts) {
    let bookEndQueueItems = _generateTemporaryOptionQueueItems(actionOpts);
    return _queueAndReturn(
      [bookEndQueueItems[0], [func, null], bookEndQueueItems[1]],
      actionOpts
    );
  };

  this.move = function (movementArg, actionOpts) {
    let arg = processCursorMovementArg(
      movementArg,
      _cursorPosition,
      _getAllChars()
    );

    let bookEndQueueItems = _generateTemporaryOptionQueueItems(actionOpts);
    let moveArg = arg.isString ? movementArg : Math.sign(movementArg);

    return _queueAndReturn(
      [
        bookEndQueueItems[0],
        // Duplicate this queue item a certain number of times.
        ...([...Array(Math.abs(movementArg) || 1)]
          .fill(null)
          .map(() => [_move, moveArg, _freezeCursorMeta]) as QueueItem[]),
        bookEndQueueItems[1],
      ],
      actionOpts
    );
  };

  this.options = function (opts) {
    return _queueAndReturn([[_options, opts]], opts);
  };

  this.pause = function (ms, actionOpts) {
    return _queueAndReturn([[_pause, ms]], actionOpts);
  };

  this.type = function (string, actionOpts) {
    let bookEndQueueItems = _generateTemporaryOptionQueueItems(actionOpts);
    let chunkedString = maybeChunkStringAsHtml(string, _opts.html);
    let itemsToQueue = [
      bookEndQueueItems[0],
      ...queueMany(chunkedString, _type, _freezeCursorMeta, true),
      bookEndQueueItems[1],
    ];

    return _queueAndReturn(itemsToQueue, actionOpts);
  };

  this.is = function (key) {
    return _statuses[key];
  };

  this.destroy = function (shouldRemoveCursor = true) {
    _timeouts = destroyTimeouts(_timeouts);
    shouldRemoveCursor && removeNode(_cursor);
    _statuses.destroyed = true;
  };

  this.freeze = function () {
    _statuses["frozen"] = true;
  };

  this.unfreeze = function () {
    _statuses["frozen"] = false;
    _fire();
  };

  this.reset = function () {
    !this.is("destroyed") && this.destroy();

    _queue.reset();

    _cursorPosition = 0;

    for (let property in _statuses) {
      _statuses[property] = false;
    }

    _elementIsInput ? (_element.value = "") : (_element.innerHTML = "");

    return this;
  };

  this.go = function () {
    if (_statuses.started) {
      return this;
    }

    _attachCursor();

    if (!_opts.waitUntilVisible) {
      _fire();
      return this;
    }

    fireWhenVisible(_element, _fire.bind(this));

    return this;
  };

  this.getQueue = function () {
    return _queue;
  };

  this.getOptions = function () {
    return _opts;
  };

  this.getElement = function () {
    return _element;
  };

  let _element = selectorToElement(element);
  let _elementIsInput = isInput(_element);
  let _pace: number[] = [];
  let _timeouts: number[] = [];
  let _cursorPosition = 0;
  let _freezeCursorMeta = { freezeCursor: true };
  let _statuses = {
    started: false,
    completed: false,
    frozen: false,
    destroyed: false,
  };

  let _opts: Options = merge(defaults, options);
  _opts = merge(_opts, {
    html: !_elementIsInput && _opts.html,
    nextStringDelay: calculateDelay(_opts.nextStringDelay),
    loopDelay: calculateDelay(_opts.loopDelay),
  });

  let _id = generateHash();
  let _queue = Queue([[_pause, _opts.startDelay]]);
  _element.dataset.typeitId = _id;

  // Used to set a "placeholder" space in the element, so that it holds vertical sizing before anything's typed.
  appendStyleBlock(
    `[data-typeit-id]:before {content: '.'; display: inline-block; width: 0; visibility: hidden;}`
  );

  let _shouldRenderCursor = _opts.cursor && !_elementIsInput;
  let _cursor = _setUpCursor();

  _opts.strings = _maybePrependHardcodedStrings(asArray(_opts.strings));

  // Only generate a queue if we have strings
  // and this isn't a reset of a previous instance,
  // in which case we'd have a pre-defined queue.

  if (_opts.strings.length) {
    _generateQueue();
  }
}
