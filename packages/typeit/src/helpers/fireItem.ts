import { CURSOR_ANIMATION_RESTART_DELAY } from "../constants";
import { El, QueueItem, QueueMapPair } from "../types";
import beforePaint from "./beforePaint";
import createCursorWrapper from "./createCursorWrapper";
import destroyCursorWrapper from "./destroyCursorWrapper";
import rebuildCursorAnimation from "./rebuildCursorAnimation";

let execute = (queueItem: QueueItem) => queueItem.func?.call(this);

interface FireItemArgs {
  index: number;
  queueItems: QueueMapPair[];
  wait: (...args: any) => Promise<void>;
  cursor: El;
}

let fireItem = async ({
  index,
  queueItems,
  wait,
  cursor,
}: FireItemArgs): Promise<number> => {
  let queueItem = queueItems[index][1];
  let instantQueue = [];
  let tempIndex = index;
  let futureItem = queueItem;
  let shouldBeGrouped = () => futureItem && !futureItem.delay;

  destroyCursorWrapper(cursor);

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

  let animation = cursor.getAnimations()[0];
  let timingOptions = animation.effect.getComputedTiming();
  let frames = animation.effect.getKeyframes();
  
  await wait(async () => {
    // Pause the cursor while stuff is happening.
    if(queueItem.shouldPauseCursor()) {
      animation.cancel();
    }

    await beforePaint(() => {    
      execute(queueItem);
    })
  }, queueItem.delay);

  let delay = queueItem.shouldPauseCursor() ? CURSOR_ANIMATION_RESTART_DELAY : 0;

  rebuildCursorAnimation(cursor as El, delay, frames, timingOptions);

  createCursorWrapper(cursor);

  return index;
};

export default fireItem;
