export type TypeItInstance = (
  element: El | string,
  options: Options
) => void;

export type Character = {
  node: El | null;
  content: string | Node;
};

export type Options = {
  breakLines?: boolean;
  cursor?: boolean;
  cursorChar?: string;
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
  strings?: string[];
  waitUntilVisible?: boolean;
  beforeString?: Function;
  afterString?: Function;
  beforeStep?: Function;
  afterStep?: Function;
  afterComplete?: Function;
};

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
  typeable?: boolean;
  deletable?: boolean;
};

export type QueueMapPair = [Symbol, QueueItem];

export interface El extends HTMLElement {
  value: string | number;
  originalParent?: HTMLElement;
}

export type Sides = "START" | "END";
