/**
 * Create several queue items containing a specific action.
 *
 * @param {integer}
 * @param {object}
 * @return {array}
 */
export default (arrayOrNumber, whatToQueue, shouldBookEnd = false) => {
  let isNumber = !Array.isArray(arrayOrNumber);
  let totalNumberOfItems = arrayOrNumber.length;
  arrayOrNumber = isNumber ? new Array(arrayOrNumber).fill(0) : arrayOrNumber;

  return arrayOrNumber.map((item, index) => {
    if (isNumber) {
      return whatToQueue;
    }

    let queueItem = [whatToQueue, item];

    if (shouldBookEnd) {
      // Tag as first character of arrayOrNumber for callback usage.
      if (index === 0) {
        queueItem.push({
          isFirst: true
        });
      }

      if (index + 1 === totalNumberOfItems) {
        queueItem.push({
          isLast: true
        });
      }
    }

    return queueItem;
  });
};
