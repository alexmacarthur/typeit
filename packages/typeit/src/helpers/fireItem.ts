import { QueueItem } from "../types";

let fireItem = async (queueItem: QueueItem, wait) => {
  // Only break up the event loop if needed.
  let execute = async () => queueItem.func?.call(this);

  if (queueItem.delay) {
    await wait(async () => {
      await execute();
    }, queueItem.delay);
  } else {
    await execute();
  }
}

export default fireItem;
