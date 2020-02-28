import merge from "./merge";

const setPropToMeta = (item, toMerge) => {
  item[2] = merge(item[2], toMerge) || toMerge;
  return item;
};

export default (queueItems, toMerge) => {
  if (!Array.isArray(queueItems[0])) {
    return setPropToMeta(queueItems, toMerge);
  }

  return queueItems.map(i => {
    return setPropToMeta(i, toMerge);
  });
};
