import merge from "./merge";
import isArray from "./isArray";
import { QueueItem } from "../types";

const setPropToMeta = (item, toMerge) => {
  item[2] = merge(item[2], toMerge) || toMerge;

  return item;
};

export default (queueItems: QueueItem[], toMerge) => {
  if (!isArray(queueItems[0])) {
    return setPropToMeta(queueItems, toMerge);
  }

  return queueItems.map((i) => {
    return setPropToMeta(i, toMerge);
  });
};
