import { CURSOR_WRAPPER_CLASS } from "../constants";
import { El, QueueItem, QueueMapPair } from "../types";
import beforePaint from "./beforePaint";
import createElement from "./createElement";
import createTextNode from "./createTextNode";
import destroyCursorWrapper from "./destroyCursorWrapper";
import setCursorAnimation from "./setCursorAnimation";

let execute = (queueItem: QueueItem) => queueItem.func?.call(this);

let rebuildCursorAnimation = (cursor) => {
  let animation = cursor.getAnimations()[0];

  if (!animation) {
    return;
  }
  let startTime = animation.startTime;

  animation?.cancel();

  // Create a new animation using the same
  // configuration as the previous one.
  let newAnimation = setCursorAnimation({
    cursor,
    frames: (animation.effect as any).getKeyframes(),
    timingOptions:
      animation.effect.getComputedTiming() as AnimationEffectTiming,
  });

  if (startTime) {
    newAnimation.startTime = startTime;
  }
};

interface FireItemArgs{
  index: number, 
  queueItems: QueueMapPair[], 
  wait: (...args) => Promise<void>, 
  cursor: El | void
}

let fireItem = async (
  {
    index, 
    queueItems, 
    wait, 
    cursor
  }: FireItemArgs): Promise<number> => {
  let queueItem = queueItems[index][1];
  let instantQueue = [];
  let tempIndex = index;
  let futureItem = queueItem;
  let shouldBeGrouped = () => futureItem && !futureItem.delay;

  cursor && destroyCursorWrapper(cursor);

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

  await wait(() => beforePaint(() => execute(queueItem)), queueItem.delay);

  if(cursor) {
    createCursorWrapper(cursor);
    rebuildCursorAnimation(cursor);
  }

  return index;
};

export default fireItem;
