import setMetaProperty from "./setMetaProperty";
import isArray from "./isArray";

/**
 * Create several queue items containing a specific action. If an array is passed,
 * each item in that array will be used as the argument for the action. If a number
 * is passed, the action will be copied that many times with no argument.
 *
 * @param {integer}
 * @param {object}
 * @return {array}
 */
export default (arrayOrNumber, actionToQueue, metaObject, shouldBookEnd) => {
  shouldBookEnd = shouldBookEnd || false;
  metaObject = metaObject || {};

  let isNumber = !isArray(arrayOrNumber);
  let totalNumberOfItems = arrayOrNumber.length;
  arrayOrNumber = isNumber ? new Array(arrayOrNumber).fill(0) : arrayOrNumber;

  return arrayOrNumber.map((item, index) => {
    if (isNumber) {
      return actionToQueue;
    }

    let queueItem = [actionToQueue, item, metaObject];

    if (shouldBookEnd) {
      // Tag as first character of arrayOrNumber for callback usage.
      if (index === 0) {
        queueItem = setMetaProperty(queueItem, { isFirst: true });
      }

      if (index + 1 === totalNumberOfItems) {
        queueItem = setMetaProperty(queueItem, { isLast: true });
      }
    }

    return queueItem;
  });
};
