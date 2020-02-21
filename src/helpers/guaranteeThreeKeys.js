/**
* Guarantees that a queue has three
* items with default values.
*
* @param {array} queueItem
* @return {array}
*/
export default (q) => {
  return q.map(queueItem => {
    queueItem[1] === undefined && queueItem.push(null);
    queueItem[2] === undefined && queueItem.push({});

    return queueItem;
  });
}
