import { El, QueueItem, QueueMapPair } from "../types";
import beforePaint from "./beforePaint";
import createCursorWrapper from "./createCursorWrapper";
import destroyCursorWrapper from "./destroyCursorWrapper";
import rebuildCursorAnimation from "./rebuildCursorAnimation";

let execute = (queueItem: QueueItem) => queueItem.func?.call(this);

interface FireItemArgs {
  index: number;
  queueItems: QueueMapPair[];
  wait: (...args) => Promise<void>;
  cursor: El | void;
}

let maybePauseCursorAnimation = (queueItem: QueueItem, cursor): any[] => {
  let previousAnimation = cursor && cursor.getAnimations()[0];
  let previousStartTime = null;

  if (queueItem.shouldPauseCursor()) {
    previousStartTime = previousAnimation.startTime;
    previousAnimation.cancel();
  }

  return [previousAnimation, previousStartTime];
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
  let cursorWrapperDestroyed: boolean = cursor && destroyCursorWrapper(cursor);

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
  
  let [previousAnimation, previousStartTime] = maybePauseCursorAnimation(queueItem, cursor);

  await wait(() => beforePaint(() => execute(queueItem)), queueItem.delay);

  let cursorWrapperCreated = cursor && createCursorWrapper(cursor);

  if (cursor && (cursorWrapperDestroyed || cursorWrapperCreated || queueItem.shouldPauseCursor())) {
    let options = previousAnimation?.effect.getComputedTiming() || {};

    // is start time gettin gin the way?
    // YES!!
    rebuildCursorAnimation({
      cursor,
      startTime: null,
      frames: previousAnimation?.effect.getKeyframes() || null,
      timingOptions: {...options, delay: 5500}
    });
  }

  return index;
};

export default fireItem;
