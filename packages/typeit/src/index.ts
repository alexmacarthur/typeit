import Queue from "./Queue";
import { maybeChunkStringAsHtml } from "./helpers/chunkStrings";
import expandTextNodes from "./helpers/expandTextNodes";
import appendStyleBlock from "./helpers/appendStyleBlock";
import asArray from "./helpers/asArray";
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
import {
  El,
  Options,
  QueueItem,
  ActionOpts,
  TypeItInstance,
  QueueMapPair,
  CursorOptions,
} from "./types";
import {
  CURSOR_CLASS,
  DEFAULT_STATUSES,
  DEFAULT_OPTIONS,
  PLACEHOLDER_CSS,
} from "./constants";
import duplicate from "./helpers/duplicate";
import countStepsToSelector from "./helpers/countStepsToSelector";
import fireItem from "./helpers/fireItem";
import setCursorAnimation from "./helpers/setCursorAnimation";
import processCursorOptions from "./helpers/processCursorOptions";

// Necessary for publicly exposing types.
export declare type TypeItOptions = Options;

const TypeIt: TypeItInstance = function (element, options = {}) {
  let _wait = async (
    callback: Function,
    delay: number | undefined,
    silent: boolean = false
  ): Promise<void> => {
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

  let _fireItemWithContext = (
    index: number,
    queueItems: QueueMapPair[]
  ): Promise<number> => {
    return fireItem({
      index,
      queueItems,
      wait: _wait,
      cursor: _cursor as El,
      cursorOptions: _opts.cursor as CursorOptions,
    });
  };

  let _removeNode = (node) => removeNode(node, _element);

  let _elementIsInput = () => isInput(_element);

  let _getPace = (index: number = 0): number => calculatePace(_opts)[index];

  let _getAllChars = (): El[] => getAllChars(_element);

  let _maybeAppendPause = (opts: ActionOpts = {}) => {
    let delay = opts.delay;
    delay && _queue.add({ delay });
  };

  let _queueAndReturn = (steps: QueueItem[] | QueueItem, opts: ActionOpts) => {
    _queue.add(steps);
    _maybeAppendPause(opts);

    return this;
  };

  let _getDerivedCursorPosition = () =>
    _predictedCursorPosition ?? _cursorPosition;

  let _generateTemporaryOptionQueueItems = (
    newOptions: Options = {}
  ): QueueItem[] => {
    return [
      { func: () => _options(newOptions) },
      { func: () => _options(_opts) },
    ];
  };

  /**
   * Add items to the queue with a split pause
   * wrapped around them.
   */
  let _addSplitPause = (items: QueueItem[]) => {
    let delay = _opts.nextStringDelay;

    _queue.add([{ delay: delay[0] }, ...items, { delay: delay[1] }]);
  };

  /**
   * Provided it's a non-form element and the options is provided,
   * set up the cursor element for the
   */
  let _setUpCursor = (): void | El => {
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

      return cursor as El;
    }

    cursor.innerHTML = getParsedBody(_opts.cursorChar).innerHTML;

    return cursor as El;
  };

  /**
   * Attach it to the DOM so, along with the required CSS transition.
   */
  let _attachCursor = async () => {
    !_elementIsInput() && _cursor && _element.appendChild(_cursor);

    if (_shouldRenderCursor) {
      setCursorStyles(_id, _element);

      (_cursor as El).dataset.tiAnimationId = _id;

      let { animation } = _opts.cursor as CursorOptions;
      let { frames, options } = animation;

      setCursorAnimation({
        frames,
        cursor: _cursor as El,
        options: {
          duration: _opts.cursorSpeed,
          ...options,
        },
      });
    }
  };

  /**
   * Based on provided strings, generate a TypeIt queue
   * to be fired for each character in the string.
   */
  let _generateQueue = () => {
    let strings = (_opts.strings as string[]).filter((string) => !!string);

    strings.forEach((string, index) => {
      this.type(string);

      // This is the last string. Get outta here.
      if (index + 1 === strings.length) {
        return;
      }

      let splitItems: QueueItem[] = _opts.breakLines
        ? [{ func: () => _type(createElement("BR")), typeable: true }]
        : duplicate(
            {
              func: _delete,
              delay: _getPace(1),
            },
            _queue.getTypeable().length
          );

      _addSplitPause(splitItems);
    });
  };

  /**
   * 1. Reset queue.
   * 2. Reset initial pause.
   */
  let _prepLoop = async (delay: number) => {
    let derivedCursorPosition = _getDerivedCursorPosition();
    derivedCursorPosition && (await _move({ value: derivedCursorPosition }));

    // Grab all characters currently mounted to the DOM,
    // in order to wipe the slate clean before restarting.
    //
    // It's important to first convert each deletion to a
    // queue item, so that we can take advantage of the same
    // cursor-pausing logic (and anything else that might be
    // introduced in the future).
    let queueItems: QueueMapPair[] = _getAllChars().map((c) => {
      return [
        Symbol(),
        {
          func: _delete,
          delay: _getPace(1),
          deletable: true,
          shouldPauseCursor: () => true,
        },
      ];
    });

    for (let index = 0; index < queueItems.length; index++) {
      await _fireItemWithContext(index, queueItems);
    }

    _queue.reset();
    _queue.set(0, { delay });
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

      _addSplitPause(
        duplicate(
          {
            func: _delete,
            delay: _getPace(1),
            deletable: true,
          },
          _getAllChars().length
        )
      );

      return strings;
    }

    let hardCodedStrings = existingMarkup
      .replace(/<!--(.+?)-->/g, "")
      .trim()
      .split(/<br(?:\s*?)(?:\/)?>/);

    return hardCodedStrings.concat(strings);
  };

  /**
   * Execute items in the queue.
   *
   * @param remember If false, each queue item will be destroyed once executed.
   * @returns
   */
  let _fire = async (remember = true): Promise<TypeItInstance> => {
    _statuses.started = true;

    // @todo remove this eventually..
    // console.log(
    //   "Total time:",
    //   queueItems.reduce((total, step) => {
    //     total = total + step.delay;

    //     return total;
    //   }, 0)
    // );

    let cleanUp = (qKey) => {
      _queue.done(qKey, !remember);
    };

    try {
      let queueItems = [..._queue.getQueue()] as QueueMapPair[];

      for (let index = 0; index < queueItems.length; index++) {
        let [queueKey, queueItem] = queueItems[index];

        // Only execute items that aren't done yet.
        if (queueItem.done) continue;

        // Because calling .delete() with no parameters will attempt to
        // delete all "typeable" characters, we may overfetch, since some characters
        // in the queue may already be deleted. This ensures that we do not attempt to
        // delete a character that isn't actually mounted to the DOM.
        if (
          !queueItem.deletable ||
          (queueItem.deletable && _getAllChars().length)
        ) {
          let newIndex = await _fireItemWithContext(index, queueItems);

          // Ensure each skipped item goes through the cleanup process,
          // so that methods like .flush() don't get messed up.
          Array(newIndex - index)
            .fill(index + 1)
            .map((x, y) => x + y)
            .forEach((i) => {
              let [key] = queueItems[i];

              cleanUp(key);
            });

          index = newIndex;
        }

        cleanUp(queueKey);
      }

      if (!remember) {
        return this;
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

  /**
   * Move type cursor by a given number.
   */
  let _move = async (step): Promise<void> => {
    _cursorPosition = updateCursorPosition(
      step,
      _cursorPosition,
      _getAllChars()
    );

    repositionCursor(_element, _getAllChars(), _cursorPosition);
  };

  /**
   * Insert a single or many characters into the target element.
   */
  let _type = (char): void => insertIntoElement(_element, char);

  let _options = async (opts) => (_opts = merge(_opts, opts));

  let _empty = async () => {
    if (_elementIsInput()) {
      _element.value = "";
      return;
    }

    _getAllChars().forEach(_removeNode);

    return;
  };

  let _delete = (): void => {
    let allChars = _getAllChars();

    if (!allChars.length) return;

    if (_elementIsInput()) {
      _element.value = (_element.value as string).slice(0, -1);
    } else {
      _removeNode(allChars[_cursorPosition]);
    }
  };

  this.break = function (actionOpts: ActionOpts) {
    return _queueAndReturn(
      {
        func: () => _type(createElement("BR")),
        typeable: true,
      },
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
    let typeableQueueItems = _queue.getTypeable();

    let rounds = (() => {
      if (num === null) {
        return typeableQueueItems.length;
      }

      if (isNumber(num)) {
        return num;
      }

      return countStepsToSelector({
        queueItems: typeableQueueItems,
        selector: num,
        cursorPosition: _getDerivedCursorPosition(),
        to,
      });
    })();

    return _queueAndReturn(
      [
        bookEndQueueItems[0],
        ...duplicate(
          {
            func: _delete,
            delay: instant ? 0 : _getPace(1),
            deletable: true,
          },
          rounds
        ),
        bookEndQueueItems[1],
      ],
      actionOpts
    );
  };

  this.empty = function (actionOpts: ActionOpts = {}) {
    return _queueAndReturn({ func: _empty }, actionOpts);
  };

  this.exec = function (
    func: (instance: TypeItInstance) => any,
    actionOpts: ActionOpts = {}
  ) {
    let bookEndQueueItems = _generateTemporaryOptionQueueItems(actionOpts);

    return _queueAndReturn(
      [bookEndQueueItems[0], { func: () => func(this) }, bookEndQueueItems[1]],
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

    let numberOfSteps = countStepsToSelector({
      queueItems: _queue.getTypeable(),
      selector: movementArg === null ? "" : movementArg,
      to,
      cursorPosition: _getDerivedCursorPosition(),
    });
    let directionalStep = numberOfSteps < 0 ? -1 : 1;

    _predictedCursorPosition = _getDerivedCursorPosition() + numberOfSteps;

    return _queueAndReturn(
      [
        bookEndQueueItems[0],
        ...duplicate(
          {
            func: () => _move(directionalStep),
            delay: instant ? 0 : _getPace(),
            cursorable: true,
          },
          Math.abs(numberOfSteps)
        ),
        bookEndQueueItems[1],
      ],
      actionOpts
    );
  };

  this.options = function (
    opts: Options | (() => Options),
    actionOpts: ActionOpts = {}
  ) {
    opts = handleFunctionalArg<Options>(opts);

    _options(opts);

    return _queueAndReturn({}, actionOpts);
  };

  this.pause = function (
    milliseconds: number | (() => number),
    actionOpts: ActionOpts = {}
  ) {
    return _queueAndReturn(
      { delay: handleFunctionalArg<number>(milliseconds) },
      actionOpts
    );
  };

  this.type = function (
    string: string | (() => string),
    actionOpts: ActionOpts = {}
  ) {
    string = handleFunctionalArg<string>(string);

    let { instant } = actionOpts;
    let bookEndQueueItems = _generateTemporaryOptionQueueItems(actionOpts);
    let chars = maybeChunkStringAsHtml(string, _opts.html);

    let charsAsQueueItems = chars.map((char): QueueItem => {
      return {
        func: () => _type(char),
        char,
        delay: instant || isNonVoidElement(char) ? 0 : _getPace(),
        typeable: char.nodeType === Node.TEXT_NODE,
      };
    });

    let itemsToQueue = [
      bookEndQueueItems[0],
      { func: async () => await _opts.beforeString(string, this) },
      ...charsAsQueueItems,
      { func: async () => await _opts.afterString(string, this) },
      bookEndQueueItems[1],
    ];

    return _queueAndReturn(itemsToQueue, actionOpts);
  };

  this.is = function (key): boolean {
    return _statuses[key];
  };

  this.destroy = function (shouldRemoveCursor = true) {
    _timeouts = destroyTimeouts(_timeouts);
    handleFunctionalArg<boolean>(shouldRemoveCursor) &&
      _cursor &&
      _removeNode(_cursor);
    _statuses.destroyed = true;
  };

  this.freeze = function () {
    _statuses.frozen = true;
  };

  this.unfreeze = () => {};

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

  /**
   * Can only be called once.
   */
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

  /**
   * Like `.go()`, but more... "off the grid."
   *
   * - won't trigger `afterComplete` callback
   * - items won't be replayed after `.reset()`
   *
   * When called, all non-done items will be "flushed" --
   * that is, executed, but not remembered.
   */
  this.flush = function (cb: () => any = () => {}) {
    _attachCursor();

    _fire(false).then(cb);

    return this;
  };

  this.getQueue = () => _queue;
  this.getOptions = () => _opts;
  this.updateOptions = (options: Options) => _options(options);
  this.getElement = () => _element;

  let _element = selectorToElement(element);
  let _timeouts: number[] = [];
  let _cursorPosition = 0;
  let _predictedCursorPosition = null;
  let _statuses = merge({}, DEFAULT_STATUSES);

  options.cursor = processCursorOptions(
    options.cursor ?? DEFAULT_OPTIONS.cursor
  );

  let _opts: Options = merge(DEFAULT_OPTIONS, options);
  _opts = merge(_opts, {
    html: !_elementIsInput() && _opts.html,
    nextStringDelay: calculateDelay(_opts.nextStringDelay),
    loopDelay: calculateDelay(_opts.loopDelay),
  });

  let _id = generateHash();
  let _queue = Queue([{ delay: _opts.startDelay }]);

  _element.dataset.typeitId = _id;

  // Used to set a "placeholder" space in the element, so that it holds vertical sizing before anything's typed.
  appendStyleBlock(PLACEHOLDER_CSS);

  let _shouldRenderCursor = !!_opts.cursor && !_elementIsInput();
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
