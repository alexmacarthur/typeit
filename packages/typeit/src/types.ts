export type TypeItInstance = (
  element: Element | string,
  options: Options
) => void;

export type Character = {
  node: Element | null;
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

export type Element = HTMLElement &
  CharacterData &
  Node &
  ChildNode & {
    value: string | number;
    originalParent?: HTMLElement;
  };

export type Sides = "START" | "END";
