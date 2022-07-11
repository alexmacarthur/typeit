import { CURSOR_ANIMATION_RESTART_DELAY } from "../constants";
import { El, QueueItem, QueueMapPair } from "../types";
import beforePaint from "./beforePaint";
import rebuildCursorAnimation from "./rebuildCursorAnimation";

let execute = (queueItem: QueueItem) => queueItem.func?.call(this);

interface FireItemArgs {
  index: number;
  queueItems: QueueMapPair[];
  wait: (...args: any) => Promise<void>;
  cursor: El | undefined;
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

  let fire = async (): Promise<{hasAnimation: boolean, timingOptions: object, frames: AnimationKeyFrame[]}> => {
    // An animation is only registered on the cursor when it's made visible. 
    // If the cursor has been disabled, there won't be one here.
    let animations = cursor?.getAnimations() || [];
    let animation = animations[0];
    let hasAnimation = animations.length > 0;
    let timingOptions: object, frames: AnimationKeyFrame[];

    if(hasAnimation) {
      timingOptions = cursor ? {
        ...animation.effect.getComputedTiming(),
        delay: queueItem.shouldPauseCursor() ? CURSOR_ANIMATION_RESTART_DELAY : 0
      } : {};
      frames = cursor ? animation.effect.getKeyframes() : [];
    }
    
    await wait(async () => {
      // Pause the cursor while stuff is happening.
      if(hasAnimation && queueItem.shouldPauseCursor()) {
        animation.cancel();
      }

      await beforePaint(() => {    
        execute(queueItem);
      })
    }, queueItem.delay);

    return { hasAnimation, frames, timingOptions };
  }

  let { hasAnimation, frames, timingOptions } = await fire();

  hasAnimation && rebuildCursorAnimation({
    cursor,
    frames,
    timingOptions
  });

  return index;
};

export default fireItem;
