import { CursorOptions, El, QueueItem, QueueMapPair } from "../types";
import beforePaint from "./beforePaint";
import getAnimationFromElement from "./getAnimationFromElement";
import rebuildCursorAnimation from "./rebuildCursorAnimation";

let execute = (queueItem: QueueItem) => queueItem.func?.call(null);

interface FireItemArgs {
  index: number;
  queueItems: QueueMapPair[];
  wait: (...args: any) => Promise<void>;
  cursor: El | undefined;
  cursorOptions: CursorOptions;
}

let fireItem = async ({
  index,
  queueItems,
  wait,
  cursor,
  cursorOptions,
}: FireItemArgs): Promise<number> => {
  let queueItem = queueItems[index][1];
  let instantQueue = [];
  let tempIndex = index;
  let futureItem = queueItem;
  let shouldBeGrouped = () => futureItem && !futureItem.delay;
  let shouldPauseCursor =
    queueItem.shouldPauseCursor() && cursorOptions.autoPause;

  // Crawl through the queue and group together all items that
  // do not have have a delay and can be executed instantly.
  while (shouldBeGrouped()) {
    instantQueue.push(futureItem);

    shouldBeGrouped() && tempIndex++;
    futureItem = queueItems[tempIndex] ? queueItems[tempIndex][1] : null;
  }

  if (instantQueue.length) {
    // All are executed together before the browser has a chance to repaint.
    await beforePaint(async () => {
      for (let q of instantQueue) {
        await execute(q);
      }
    });

    // Important! Because we moved into the future, the index
    // needs to be modified and returned for accurate remaining execution.
    return tempIndex - 1;
  }

  // An animation is only registered on the cursor when it's made visible.
  // If the cursor has been disabled, there won't be one here.
  let animation = getAnimationFromElement(cursor);
  let options;

  if (animation) {
    options = {
      ...animation.effect.getComputedTiming(),
      delay: shouldPauseCursor ? cursorOptions.autoPauseDelay : 0,
    };
  }

  await wait(async () => {
    // If it's a qualified queue item, pause the cursor at the
    // beginning of the item's execution by destroying the aniatmion.
    // Immediately after completing, the animation will be recreated (with a delay).
    if (animation && shouldPauseCursor) {
      animation.cancel();
    }

    await beforePaint(() => {
      execute(queueItem);
    });
  }, queueItem.delay);

  await rebuildCursorAnimation({
    cursor,
    options,
    cursorOptions,
  });

  return index;
};

export default fireItem;
