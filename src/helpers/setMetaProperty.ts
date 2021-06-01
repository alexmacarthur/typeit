import merge from "./merge";
import { QueueItem } from "../types";

export default (item: QueueItem, toMerge) => {
  item[2] = merge(item[2], toMerge) || toMerge;

  return item;
};
