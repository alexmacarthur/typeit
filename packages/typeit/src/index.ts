import Queue from "./Queue";
import { maybeChunkStringAsHtml } from "./helpers/chunkStrings";
import expandTextNodes from "./helpers/expandTextNodes";
import appendStyleBlock from "./helpers/appendStyleBlock";
import asArray from "./helpers/asArray";
import calculateCursorSteps from "./helpers/calculateCursorSteps";
import calculateDelay from "./helpers/calculateDelay";
import calculatePace from "./helpers/calculatePace";
import createElement from "./helpers/createElement";
import destroyTimeouts from "./helpers/destroyTimeouts";
import generateHash from "./helpers/generateHash";
import getAllChars from "./helpers/getAllChars";
import fireWhenVisible from "./helpers/fireWhenVisible";
import getParsedBody from "./helpers/getParsedBody";
import handleFunctionalArg from "./helpers/handleFunctionalArg";
import isNumber from "./helpers/isNumber";
import insertIntoElement from "./helpers/insertIntoElement";
import isInput from "./helpers/isInput";
import updateCursorPosition from "./helpers/updateCursorPosition";
import merge from "./helpers/merge";
import removeNode from "./helpers/removeNode";
import repositionCursor from "./helpers/repositionCursor";
import selectorToElement from "./helpers/selectorToElement";
import isNonVoidElement from "./helpers/isNonVoidElement";
import wait from "./helpers/wait";
import { setCursorStyles } from "./helpers/setCursorStyles";
import { Element, Options, QueueItem, ActionOpts, Sides, TypeItInstance } from "./types";
import {
  CURSOR_CLASS,
  DEFAULT_STATUSES,
  DEFAULT_OPTIONS,
  START,
  DATA_ATTRIBUTE,
} from "./contants";

// Necessary for publicly exposing types.
export declare type TypeItOptions = Options;

const TypeIt: TypeItInstance = function (element, options = {}) {
  let _wait = async (
    callback: Function,
    delay: number,
    silent: boolean = false
  ) => {
    if (_statuses.frozen) {
      await new Promise<void>((resolve) => {
        this.unfreeze = () => {
          _statuses.frozen = false;
          resolve();
        };
      });
    }

    silent || (await _opts.beforeStep(this));

    await wait(callback, delay, _timeouts);

    silent || (await _opts.afterStep(this));
  };

  let _elementIsInput = () => isInput(_element);

  let _getPace = (index: number): number => calculatePace(_opts)[index];

  let _getAllChars = (): Element[] => getAllChars(_element);

  let _getActionPace = (instant: boolean, paceIndex: number = 0): number => {
    return instant ? _getPace(paceIndex) : 0;
  };

  let _maybeAppendPause = (opts = {}) => {
    let delay = opts["delay"];
    delay && _queue.add(() => _pause(delay));
  };

  let _queueAndReturn = (steps: QueueItem[] | QueueItem, opts: Options) => {
    _queue.add(steps);
    _maybeAppendPause(opts);

    return this;
  };

  let _generateTemporaryOptionQueueItems = (
    newOptions: Options = {}
  ): QueueItem[] => {
    return [() => _options(newOptions), () => _options(_opts)];
  };

  /**
   * Add items to the queue with a split pause
   * wrapped around them.
   */
  let _addSplitPause = (items: QueueItem[]) => {
    let delay = _opts.nextStringDelay;

    _queue.add([() => _pause(delay[0]), ...items, () => _pause(delay[1])]);
  };

  /**
   * Provided it's a non-form element and the options is provided,
   * set up the cursor element for the
   *
   * @return {void}
   */
  let _setUpCursor = (): undefined | Element => {
    if (_elementIsInput()) {
      return;
    }

    // If we have a cursor node from a previous instance (prior to a reset()),
    // there's no need to recreate one now.
    let cursor = createElement("span");
    cursor.className = CURSOR_CLASS;

    // Don't bother touching up the cursor if we don't want it to visibly render anyway.
    if (!_shouldRenderCursor) {
      cursor.style.visibility = "hidden";

      return cursor as Element;
    }

    cursor.innerHTML = getParsedBody(_opts.cursorChar).innerHTML;

    return cursor as Element;
  };

  /**
   * Attach it to the DOM so, along with the required CSS transition.
   */
  let _attachCursor = async () => {
    !_elementIsInput() && _element.appendChild(_cursor);

    _shouldRenderCursor && setCursorStyles(_id, _opts, _element);
  };

  let _disableCursorBlink = (shouldDisable: boolean): void => {
    if (_shouldRenderCursor) {
      _cursor.classList.toggle("disabled", shouldDisable);
      _cursor.classList.toggle("with-delay", !shouldDisable);
    }
  };

  /**
   * Based on provided strings, generate a TypeIt queue
   * to be fired for each character in the string.
   */
  let _generateQueue = () => {
    let strings = _opts.strings.filter((string) => !!string);

    strings.forEach((string, index) => {
      let chars = maybeChunkStringAsHtml(string, _opts.html);

      _queue.add(() => _type({ chars }));

      // This is the last string. Get outta here.
      if (index + 1 === strings.length) {
        return;
      }

      let splitPauseArgs: QueueItem[] = [
        _opts.breakLines
          ? () =>
              _type({
                chars: [createElement("BR")],
                silent: true,
              })
          : () => _delete({ num: chars.length }),
      ];

      _addSplitPause(splitPauseArgs);
    });
  };

  /**
   * 1. Reset queue.
   * 2. Reset initial pause.
   */
  let _prepLoop = async (delay) => {
    _cursorPosition && (await _move({ value: _cursorPosition }));
    _queue.reset();
    _queue.set(0, () => _pause(delay));

    await _delete({ num: null });
  };

  let _maybePrependHardcodedStrings = (strings): string[] => {
    let existingMarkup = _element.innerHTML;

    if (!existingMarkup) {
      return strings;
    }

    // Once we've saved the existing markup to a variable,
    // wipe the element clean to prepare for typing.
    _element.innerHTML = "";

    if (_opts.startDelete) {
      _element.innerHTML = existingMarkup;
      expandTextNodes(_element);

      _addSplitPause([() => _delete({ num: null })]);

      return strings;
    }

    let hardCodedStrings = existingMarkup.trim().split(/<br(?:\s*?)(?:\/)?>/);

    return hardCodedStrings.concat(strings);
  };

  let _fire = async (): Promise<void> => {
    _statuses.started = true;

    let queueItems = _queue.getItems();

    try {
      for (let i = 0; i < queueItems.length; i++) {
        await queueItems[i]();

        _queue.markDone(i);

        _disableCursorBlink(false);
      }

      _statuses.completed = true;

      await _opts.afterComplete(this);

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

  let _pause = (time = 0): Promise<void> => _wait(() => {}, time);

  /**
   * Move type cursor by a given number.
   */
  let _move = async ({
    value,
    to = START,
    instant = false,
  }: {
    value: string | number;
    to?: Sides;
    instant?: boolean;
  }): Promise<void> => {
    _disableCursorBlink(true);

    let numberOfSteps = calculateCursorSteps({
      el: _element,
      move: value,
      cursorPos: _cursorPosition,
      to,
    });

    let moveCursor = () => {
      _cursorPosition = updateCursorPosition(
        numberOfSteps < 0 ? -1 : 1,
        _cursorPosition,
        _getAllChars()
      );

      repositionCursor(_element, _getAllChars(), _cursorPosition);
    };

    /**
     * Depending on `instant`, either perform all cursor movements
     * in one shot, or separately over several timeouts.
     */
    await _wait(async () => {
      for (let i = 0; i < Math.abs(numberOfSteps); i++) {
        instant ? moveCursor() : await _wait(moveCursor, _getPace(0));
      }

      // If it's 'instant,' the individual moves won't be delayed, so do so here.
    }, _getActionPace(instant));
  };

  /**
   * Insert a single or many characters into the target element.
   */
  let _type = ({
    chars,
    silent = false,
    instant = false,
  }: {
    chars: Partial<Element>[];
    instant?: boolean;
    silent?: boolean;
  }): Promise<void> => {
    _disableCursorBlink(true);

    return _wait(
      async () => {
        let insert = (character) => insertIntoElement(_element, character);

        silent || (await _opts.beforeString(chars, this));

        for (let char of chars) {
          instant || isNonVoidElement(char)
            ? insert(char)
            : await _wait(() => insert(char), _getPace(0));
        }

        silent || (await _opts.afterString(chars, this));
      },
      _getActionPace(instant),
      true
    );
  };

  let _options = async (opts) => {
    _opts = merge(_opts, opts);
    return;
  };

  let _empty = async () => {
    if (_elementIsInput()) {
      _element.value = "";
      return;
    }

    _getAllChars().forEach((n) => {
      removeNode(n);
    });

    return;
  };

  /**
   * Delete the number of specified characters, or all of the printed characters.
   */
  let _delete = async ({
    num = null,
    instant = false,
    to = START, // only matters when 'num' is a selector
  }: {
    num: number | string | null;
    instant?: boolean;
    to?: Sides;
  }): Promise<void> => {
    _disableCursorBlink(true);

    await _wait(async () => {
      let rounds = (() => {
        if (num === null) {
          return _getAllChars().length;
        }

        if (isNumber(num)) {
          return num;
        }

        // `num` is a selector
        return calculateCursorSteps({
          el: _element,
          move: num,
          cursorPos: _cursorPosition,
          to,
        });
      })();

      let deleteIt = () => {
        let allChars = _getAllChars();

        if (!allChars.length) return;

        if (_elementIsInput()) {
          _element.value = (_element.value as string).slice(0, -1);
        } else {
          removeNode(allChars[_cursorPosition]);
        }
      };

      for (let i = 0; i < rounds; i++) {
        instant ? deleteIt() : await _wait(deleteIt, _getPace(1));
      }
    }, _getActionPace(instant, 1));

    /**
     * If it's specified, keep deleting until all characters are gone. This is
     * the only time when a SINGLE queue action (`delete()`) deals with multiple
     * characters at once. I don't like it, but need to implement like this right now.
     */
    if (num === null && _getAllChars().length - 1 > 0) {
      await _delete({ num: null });
    }
  };

  this.break = function (actionOpts) {
    return _queueAndReturn(
      () => _type({ chars: [createElement("BR")], silent: true }),
      actionOpts
    );
  };

  this.delete = function (
    numCharacters: number | string | (() => number | null) = null,
    actionOpts: ActionOpts = {}
  ) {
    numCharacters = handleFunctionalArg<number>(numCharacters);
    let bookEndQueueItems = _generateTemporaryOptionQueueItems(actionOpts);
    let num = numCharacters;
    let { instant, to } = actionOpts;

    return _queueAndReturn(
      [
        bookEndQueueItems[0],
        () => _delete({ num, instant, to }),
        bookEndQueueItems[1],
      ],
      actionOpts
    );
  };

  this.empty = function (actionOpts = {}) {
    return _queueAndReturn(_empty, actionOpts);
  };

  this.exec = function (func: (instance: TypeItInstance) => any, actionOpts) {
    let bookEndQueueItems = _generateTemporaryOptionQueueItems(actionOpts);
    return _queueAndReturn(
      [bookEndQueueItems[0], () => func(this), bookEndQueueItems[1]],
      actionOpts
    );
  };

  this.move = function (
    movementArg: string | number | (() => string | number),
    actionOpts: ActionOpts = {}
  ) {
    movementArg = handleFunctionalArg<string | number>(movementArg);
    let bookEndQueueItems = _generateTemporaryOptionQueueItems(actionOpts);
    let { instant, to } = actionOpts;

    let moveArgs = {
      value: movementArg === null ? "" : movementArg,
      to,
      instant,
    };

    return _queueAndReturn(
      [bookEndQueueItems[0], () => _move(moveArgs), bookEndQueueItems[1]],
      actionOpts
    );
  };

  this.options = function (opts: Options | (() => Options)) {
    opts = handleFunctionalArg<Options>(opts);

    return _queueAndReturn(() => _options(opts), opts);
  };

  this.pause = function (
    milliseconds: number | (() => number),
    actionOpts: ActionOpts = {}
  ) {
    return _queueAndReturn(
      () => _pause(handleFunctionalArg<number>(milliseconds)),
      actionOpts
    );
  };

  this.type = function (
    string: string | (() => string),
    actionOpts: ActionOpts = {}
  ) {
    string = handleFunctionalArg<string>(string);

    let bookEndQueueItems = _generateTemporaryOptionQueueItems(actionOpts);
    let chars = maybeChunkStringAsHtml(string, _opts.html);

    let { instant } = actionOpts;

    /**
     * When a string is intended to be typed instantly, pass one queue item with
     * the argument being all of the characters of that string.
     */
    let itemsToQueue = [
      bookEndQueueItems[0],
      () => _type({ chars, instant }),
      bookEndQueueItems[1],
    ];

    return _queueAndReturn(itemsToQueue, actionOpts);
  };

  this.is = function (key): boolean {
    return _statuses[key];
  };

  this.destroy = function (shouldRemoveCursor = true) {
    _timeouts = destroyTimeouts(_timeouts);
    handleFunctionalArg<boolean>(shouldRemoveCursor) && removeNode(_cursor);
    _statuses.destroyed = true;
  };

  this.freeze = function () {
    _statuses.frozen = true;
  };

  this.unfreeze = function () {};

  this.reset = function (rebuild: ((TypeIt) => typeof TypeIt) | undefined) {
    !this.is("destroyed") && this.destroy();

    // If provided, the queue can be totally regenerated.
    if (rebuild) {
      _queue.wipe();
      rebuild(this);
    } else {
      _queue.reset();
    }

    _cursorPosition = 0;

    for (let property in _statuses) {
      _statuses[property] = false;
    }

    _element[_elementIsInput() ? "value" : "innerHTML"] = "";

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

  this.getQueue = () => _queue;

  this.getOptions = () => _opts;

  this.updateOptions = (options: Options) => _options(options);

  this.getElement = () => _element;

  let _element = selectorToElement(element);
  let _timeouts: number[] = [];
  let _cursorPosition = 0;
  let _statuses = merge({}, DEFAULT_STATUSES);

  let _opts: Options = merge(DEFAULT_OPTIONS, options);
  _opts = merge(_opts, {
    html: !_elementIsInput() && _opts.html,
    nextStringDelay: calculateDelay(_opts.nextStringDelay),
    loopDelay: calculateDelay(_opts.loopDelay),
  });

  let _id = generateHash();
  let _queue = Queue([() => _pause(_opts.startDelay)]);
  _element.dataset.typeitId = _id;

  // Used to set a "placeholder" space in the element, so that it holds vertical sizing before anything's typed.
  appendStyleBlock(
    `[${DATA_ATTRIBUTE}]:before {content: '.'; display: inline-block; width: 0; visibility: hidden;}`
  );

  let _shouldRenderCursor = _opts.cursor && !_elementIsInput();
  let _cursor = _setUpCursor();

  _opts.strings = _maybePrependHardcodedStrings(asArray<string>(_opts.strings));

  // Only generate a queue if we have strings
  // and this isn't a reset of a previous instance,
  // in which case we'd have a pre-defined queue.
  if (_opts.strings.length) {
    _generateQueue();
  }
};

export default TypeIt;
