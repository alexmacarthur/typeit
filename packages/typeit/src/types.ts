export type TypeItInstance = (element: El | string, options: Options) => void;

export type Character = {
  node: El | null;
  content: string | Node;
};

export interface CursorAnimationOptions {
  frames?: AnimationKeyFrame[];
  options?: Partial<AnimationEffectTiming>;
}

export interface CursorOptions {
  autoPause?: boolean;
  autoPauseDelay?: number;
  animation?: CursorAnimationOptions;
}

export interface Options {
  breakLines?: boolean;
  cursorChar?: string;
  cursor?: CursorOptions | boolean;

  // @todo: Remove in next major release.
  cursorSpeed?: number;
  deleteSpeed?: null | number;
  html?: boolean;
  lifeLike?: boolean;
  loop?: boolean;
  loopDelay?: number;
  nextStringDelay?: number;
  speed?: number;
  startDelay?: number;
  startDelete?: boolean;
  strings?: string[] | string;
  waitUntilVisible?: boolean;
  beforeString?: Function;
  afterString?: Function;
  beforeStep?: Function;
  afterStep?: Function;
  afterComplete?: Function;
}

export type ActionOpts = Options & {
  to?: Sides;
  instant?: boolean;
  delay?: number;
};

export type QueueItem = {
  done?: boolean;
  func?: () => any;
  delay?: number;
  char?: any;

  // A queue item that can be visibly 'typed' to the
  // screen, including those queued with ".type()" and ".break()"
  typeable?: boolean;

  deletable?: boolean;

  // An explicit indicator that a queue item should pause
  // the cursor animation during execution.
  cursorable?: boolean;

  // An item should pause the cursor of it's
  // EITHER "typeable," "cusorable," or "deleteable."
  shouldPauseCursor?: () => boolean;
};

export type QueueMapPair = [Symbol, QueueItem];

export interface El extends HTMLElement {
  value: string | number;
  originalParent?: HTMLElement;
}

export type Sides = "START" | "END";
