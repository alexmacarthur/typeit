import Queue, { QueueI } from "./Queue";
import {
  CURSOR_CLASS,
  DEFAULT_OPTIONS,
  DEFAULT_STATUSES,
  PLACEHOLDER_CSS,
} from "./constants";
import appendStyleBlock from "./helpers/appendStyleBlock";
import asArray from "./helpers/asArray";
import calculateDelay from "./helpers/calculateDelay";
import calculatePace from "./helpers/calculatePace";
import { maybeChunkStringAsHtml } from "./helpers/chunkStrings";
import cleanUpSkipped from "./helpers/cleanUpSkipped";
import countStepsToSelector from "./helpers/countStepsToSelector";
import createElement from "./helpers/createElement";
import destroyTimeouts from "./helpers/destroyTimeouts";
import duplicate from "./helpers/duplicate";
import expandTextNodes from "./helpers/expandTextNodes";
import fireItem from "./helpers/fireItem";
import fireWhenVisible from "./helpers/fireWhenVisible";
import generateHash from "./helpers/generateHash";
import getAllChars from "./helpers/getAllChars";
import getParsedBody from "./helpers/getParsedBody";
import handleFunctionalArg from "./helpers/handleFunctionalArg";
import insertIntoElement from "./helpers/insertIntoElement";
import isInput from "./helpers/isInput";
import isNonVoidElement from "./helpers/isNonVoidElement";
import isNumber from "./helpers/isNumber";
import merge from "./helpers/merge";
import processCursorOptions from "./helpers/processCursorOptions";
import removeNode from "./helpers/removeNode";
import repositionCursor from "./helpers/repositionCursor";
import selectorToElement from "./helpers/selectorToElement";
import setCursorAnimation from "./helpers/setCursorAnimation";
import { setCursorStyles } from "./helpers/setCursorStyles";
import splitOnBreak from "./helpers/splitOnBreak";
import updateCursorPosition from "./helpers/updateCursorPosition";
import wait from "./helpers/wait";
import {
  ActionOpts,
  CursorOptions,
  El,
  Options,
  QueueItem,
  QueueMapPair,
  Statuses,
} from "./types";

export type { Options, QueueI, QueueItem, Statuses };

class TypeIt {
  private element: El;
  private timeouts: number[];
  private cursorPosition: number;
  private predictedCursorPosition: number | null;
  private statuses: Statuses = {
    started: false,
    completed: false,
    frozen: false,
    destroyed: false,
  };
  private opts: Options;
  private id: string;
  private queue: QueueI;
  private cursor: El | null;

  unfreeze = () => {};

  constructor(element: El | string, options: Options = {}) {
    this.opts = merge(DEFAULT_OPTIONS, options);

    this.element = selectorToElement(element);
    this.timeouts = [];
    this.cursorPosition = 0;
    this.unfreeze = () => {};
    this.predictedCursorPosition = null;
    this.statuses = merge({}, DEFAULT_STATUSES);
    this.id = generateHash();
    this.queue = Queue([{ delay: this.opts.startDelay }]);
    this.#buildOptions(options);
    this.cursor = this.#setUpCursor();

    this.element.dataset.typeitId = this.id;

    appendStyleBlock(PLACEHOLDER_CSS);

    if (this.opts.strings.length) {
      this.#generateQueue();
    }
  }

  /**
   * Can only be called once.
   */
  go() {
    if (this.statuses.started) {
      return this;
    }

    this.#attachCursor();

    if (!this.opts.waitUntilVisible) {
      this.#fire();
      return this;
    }

    fireWhenVisible(this.element, this.#fire.bind(this));

    return this;
  }

  destroy(shouldRemoveCursor = true) {
    this.timeouts = destroyTimeouts(this.timeouts);
    handleFunctionalArg<boolean>(shouldRemoveCursor) &&
      this.cursor &&
      this.#removeNode(this.cursor);
    this.statuses.destroyed = true;
  }

  reset(rebuild: ((TypeIt) => typeof TypeIt) | undefined) {
    !this.is("destroyed") && this.destroy();

    // If provided, the queue can be totally regenerated.
    if (rebuild) {
      this.queue.wipe();
      rebuild(this);
    } else {
      this.queue.reset();
    }

    this.cursorPosition = 0;

    for (let property in this.statuses) {
      this.statuses[property] = false;
    }

    this.element[this.#elementIsInput() ? "value" : "innerHTML"] = "";

    return this;
  }

  is = function (key): boolean {
    return this.statuses[key];
  };

  type(string: string | (() => string), actionOpts: ActionOpts = {}) {
    string = handleFunctionalArg<string>(string);

    let { instant } = actionOpts;
    let bookEndQueueItems = this.#generateTemporaryOptionQueueItems(actionOpts);
    let chars = maybeChunkStringAsHtml(string, this.opts.html);

    let charsAsQueueItems = chars.map((char): QueueItem => {
      return {
        func: () => this.#type(char),
        char,
        delay: instant || isNonVoidElement(char) ? 0 : this.#getPace(),
        typeable: char.nodeType === Node.TEXT_NODE,
      };
    });

    let itemsToQueue = [
      bookEndQueueItems[0],
      { func: async () => await this.opts.beforeString(string, this) },
      ...charsAsQueueItems,
      { func: async () => await this.opts.afterString(string, this) },
      bookEndQueueItems[1],
    ];

    return this.#queueAndReturn(itemsToQueue, actionOpts);
  }

  break(actionOpts: ActionOpts = {}) {
    return this.#queueAndReturn(
      {
        func: () => this.#type(createElement("BR")),
        typeable: true,
      },
      actionOpts,
    );
  }

  move(
    movementArg: string | number | (() => string | number) | null,
    actionOpts: ActionOpts = {},
  ) {
    movementArg = handleFunctionalArg<string | number>(movementArg);

    let bookEndQueueItems = this.#generateTemporaryOptionQueueItems(actionOpts);
    let { instant, to } = actionOpts;

    let numberOfSteps = countStepsToSelector({
      queueItems: this.queue.getTypeable(),
      selector: movementArg === null ? "" : movementArg,
      to,
      cursorPosition: this.#derivedCursorPosition,
    });
    let directionalStep = numberOfSteps < 0 ? -1 : 1;

    this.predictedCursorPosition = this.#derivedCursorPosition + numberOfSteps;

    return this.#queueAndReturn(
      [
        bookEndQueueItems[0],
        ...duplicate(
          {
            func: () => this.#move(directionalStep),
            delay: instant ? 0 : this.#getPace(),
            cursorable: true,
          },
          Math.abs(numberOfSteps),
        ),
        bookEndQueueItems[1],
      ],
      actionOpts,
    );
  }

  exec(func: (instance: TypeIt) => any, actionOpts: ActionOpts = {}) {
    let bookEndQueueItems = this.#generateTemporaryOptionQueueItems(actionOpts);

    return this.#queueAndReturn(
      [bookEndQueueItems[0], { func: () => func(this) }, bookEndQueueItems[1]],
      actionOpts,
    );
  }

  options(opts: Options | (() => Options), actionOpts: ActionOpts = {}) {
    opts = handleFunctionalArg<Options>(opts);

    this.#updateOptions(opts);

    return this.#queueAndReturn({}, actionOpts);
  }

  pause(milliseconds: number | (() => number), actionOpts: ActionOpts = {}) {
    return this.#queueAndReturn(
      { delay: handleFunctionalArg<number>(milliseconds) },
      actionOpts,
    );
  }

  delete(
    numCharacters: number | string | (() => number | null) = null,
    actionOpts: ActionOpts = {},
  ) {
    numCharacters = handleFunctionalArg<number>(numCharacters);
    let bookEndQueueItems = this.#generateTemporaryOptionQueueItems(actionOpts);
    let num = numCharacters;
    let { instant, to } = actionOpts;
    let typeableQueueItems = this.queue.getTypeable();

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
        cursorPosition: this.#derivedCursorPosition,
        to,
      });
    })();

    return this.#queueAndReturn(
      [
        bookEndQueueItems[0],
        ...duplicate(
          {
            func: this.#delete.bind(this),
            delay: instant ? 0 : this.#getPace(1),
            deletable: true,
          },
          rounds,
        ),
        bookEndQueueItems[1],
      ],
      actionOpts,
    );
  }

  freeze() {
    this.statuses.frozen = true;
  }

  /**
   * Like `.go()`, but more... "off the grid."
   *
   * - won't trigger `afterComplete` callback
   * - items won't be replayed after `.reset()`
   *
   * When called, all non-done items will be "flushed" --
   * that is, executed, but not remembered.
   */
  flush(cb: () => any = () => {}) {
    this.#attachCursor();

    this.#fire(false).then(cb);

    return this;
  }

  getQueue() {
    return this.queue;
  }

  getOptions() {
    return this.opts;
  }

  updateOptions(options: Options) {
    return this.#updateOptions(options);
  }

  getElement() {
    return this.element;
  }

  empty(actionOpts: ActionOpts = {}) {
    return this.#queueAndReturn({ func: this.#empty.bind(this) }, actionOpts);
  }

  async #empty() {
    if (this.#elementIsInput()) {
      (this.element as HTMLInputElement).value = "";
      return;
    }

    this.#allChars.forEach(this.#removeNode.bind(this));

    return;
  }

  /**
   * Execute items in the queue.
   *
   * @param remember If false, each queue item will be destroyed once executed.
   * @returns
   */
  async #fire(remember: boolean = true) {
    this.statuses.started = true;

    let cleanUp = (qKey: Symbol) => {
      this.queue.done(qKey, !remember);
    };

    try {
      let queueItems = [...this.queue.getQueue()] as QueueMapPair[];

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
          (queueItem.deletable && this.#allChars.length)
        ) {
          let newIndex = await this.#fireItemWithContext(index, queueItems);

          cleanUpSkipped({
            index,
            newIndex,
            queueItems,
            cleanUp,
          });

          index = newIndex;
        }

        cleanUp(queueKey);
      }

      if (!remember) {
        return this;
      }

      this.statuses.completed = true;

      await this.opts.afterComplete(this);

      if (!this.opts.loop) {
        throw "";
      }

      let delay = this.opts.loopDelay;

      this.#wait(async () => {
        await this.#prepLoop(delay[0]);
        this.#fire();
      }, delay[1]);
    } catch (e) {}

    return this;
  }

  async #move(step): Promise<void> {
    this.cursorPosition = updateCursorPosition(
      step,
      this.cursorPosition,
      this.#allChars,
    );

    repositionCursor(this.element, this.#allChars, this.cursorPosition);
  }

  /**
   * 1. Reset queue.
   * 2. Reset initial pause.
   */
  async #prepLoop(delay: number) {
    let derivedCursorPosition = this.#derivedCursorPosition;
    derivedCursorPosition &&
      (await this.#move({ value: derivedCursorPosition }));

    // Grab all characters currently mounted to the DOM,
    // in order to wipe the slate clean before restarting.
    //
    // It's important to first convert each deletion to a
    // queue item, so that we can take advantage of the same
    // cursor-pausing logic (and anything else that might be
    // introduced in the future).
    let queueItems: QueueMapPair[] = this.#allChars.map((c) => {
      return [
        Symbol(),
        {
          func: this.#delete.bind(this),
          delay: this.#getPace(1),
          deletable: true,
          shouldPauseCursor: () => true,
        },
      ];
    });

    for (let index = 0; index < queueItems.length; index++) {
      await this.#fireItemWithContext(index, queueItems);
    }

    this.queue.reset();
    this.queue.set(0, { delay });
  }

  #fireItemWithContext(
    index: number,
    queueItems: QueueMapPair[],
  ): Promise<number> {
    return fireItem({
      index,
      queueItems,
      wait: this.#wait.bind(this),
      cursor: this.cursor as El,
      cursorOptions: this.opts.cursor as CursorOptions,
    });
  }

  async #wait(
    callback: Function,
    delay: number | undefined,
    silent: boolean = false,
  ): Promise<void> {
    if (this.statuses.frozen) {
      await new Promise<void>((resolve) => {
        this.unfreeze = () => {
          this.statuses.frozen = false;
          resolve();
        };
      });
    }

    silent || (await this.opts.beforeStep(this));

    await wait(callback, delay, this.timeouts);

    silent || (await this.opts.afterStep(this));
  }

  /**
   * Attach it to the DOM so, along with the required CSS transition.
   */
  async #attachCursor() {
    !this.#elementIsInput() &&
      this.cursor &&
      this.element.appendChild(this.cursor);

    if (this.#shouldRenderCursor) {
      setCursorStyles(this.id, this.element);

      (this.cursor as El).dataset.tiAnimationId = this.id;

      let { animation } = this.opts.cursor as CursorOptions;
      let { frames, options } = animation;

      setCursorAnimation({
        frames,
        cursor: this.cursor as El,
        options: {
          duration: this.opts.cursorSpeed,
          ...options,
        },
      });
    }
  }

  #elementIsInput(): boolean {
    return isInput(this.element);
  }

  #queueAndReturn(steps: QueueItem[] | QueueItem, opts: ActionOpts) {
    this.queue.add(steps);
    this.#maybeAppendPause(opts);

    return this;
  }

  #maybeAppendPause(opts: ActionOpts = {}) {
    let delay = opts.delay;
    delay && this.queue.add({ delay });
  }

  #generateTemporaryOptionQueueItems(newOptions: Options = {}): QueueItem[] {
    return [
      { func: () => this.#updateOptions(newOptions) },
      { func: () => this.#updateOptions(this.opts) },
    ];
  }

  async #updateOptions(opts) {
    this.opts = merge(this.opts, opts);
  }

  /**
   * Based on provided strings, generate a TypeIt queue
   * to be fired for each character in the string.
   */
  #generateQueue() {
    let strings = (this.opts.strings as string[]).filter((string) => !!string);

    strings.forEach((string, index) => {
      this.type(string);

      // This is the last string. Get outta here.
      if (index + 1 === strings.length) {
        return;
      }

      let splitItems: QueueItem[] = this.opts.breakLines
        ? [{ func: () => this.#type(createElement("BR")), typeable: true }]
        : duplicate(
            {
              func: this.#delete.bind(this),
              delay: this.#getPace(1),
            },
            this.queue.getTypeable().length,
          );

      this.#addSplitPause(splitItems);
    });
  }

  #buildOptions = (options: Options): void => {
    this.opts.cursor = processCursorOptions(
      options.cursor ?? DEFAULT_OPTIONS.cursor,
    );

    this.opts.strings = this.#prependHardcodedStrings(
      asArray<string>(this.opts.strings),
    );

    this.opts = merge(this.opts, {
      html: !this.#isInput && this.opts.html,
      nextStringDelay: calculateDelay(this.opts.nextStringDelay),
      loopDelay: calculateDelay(this.opts.loopDelay),
    });
  };

  #prependHardcodedStrings(strings): string[] {
    let existingMarkup = this.element.innerHTML;

    if (!existingMarkup) {
      return strings;
    }

    // Once we've saved the existing markup to a variable,
    // wipe the element clean to prepare for typing.
    this.element.innerHTML = "";

    if (this.opts.startDelete) {
      this.element.innerHTML = existingMarkup;

      expandTextNodes(this.element);

      this.#addSplitPause(
        duplicate(
          {
            func: this.#delete.bind(this),
            delay: this.#getPace(1),
            deletable: true,
          },
          this.#allChars.length,
        ),
      );

      return strings;
    }

    return splitOnBreak(existingMarkup).concat(strings);
  }

  /**
   * Provided it's a non-form element and the options is provided,
   * set up the cursor element for the animation.
   */
  #setUpCursor(): null | El {
    if (this.#isInput) {
      return null;
    }

    // If we have a cursor node from a previous instance (prior to a reset()),
    // there's no need to recreate one now.
    let cursor = createElement("span");
    cursor.className = CURSOR_CLASS;

    // Don't bother touching up the cursor if we don't want it to visibly render anyway.
    if (!this.#shouldRenderCursor) {
      cursor.style.visibility = "hidden";

      return cursor as El;
    }

    cursor.innerHTML = getParsedBody(this.opts.cursorChar).innerHTML;

    return cursor as El;
  }

  #addSplitPause(items: QueueItem[]): void {
    let delay = this.opts.nextStringDelay;

    this.queue.add([{ delay: delay[0] }, ...items, { delay: delay[1] }]);
  }

  #type(char): void {
    insertIntoElement(this.element, char);
  }

  #delete() {
    if (!this.#allChars.length) return;

    if (this.#isInput) {
      (this.element as HTMLInputElement).value = (
        (this.element as HTMLInputElement).value as string
      ).slice(0, -1);
    } else {
      this.#removeNode(this.#allChars[this.cursorPosition]);
    }
  }

  #removeNode(node: El) {
    removeNode(node, this.element);
  }

  #getPace(index: number = 0): number {
    return calculatePace(this.opts)[index];
  }

  get #derivedCursorPosition(): number {
    return this.predictedCursorPosition ?? this.cursorPosition;
  }

  get #isInput() {
    return isInput(this.element);
  }

  get #shouldRenderCursor() {
    return !!this.opts.cursor && !this.#isInput;
  }

  get #allChars(): El[] {
    return getAllChars(this.element);
  }
}

export default TypeIt;
