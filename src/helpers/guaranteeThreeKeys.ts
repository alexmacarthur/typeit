import { QueueItem } from "../types";

const defaults = [null, null, {}];

/**
 * Guarantees that a queue has three
 * items with default values.
 *
 * @param {array} queueItem
 * @return {array}
 */
export default (q: QueueItem[]): QueueItem[] => {
  return q.map((queueItem: QueueItem) => {
    return defaults.map((defaultValue, index) => {
      if (queueItem[index]) return queueItem[index];

      return defaultValue;
    });
  }) as QueueItem;
};
