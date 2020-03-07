import isArray from "./isArray";

/**
 * Given a delay value, form it into the type of object
 * that will be used by Instance().
 *
 * @param {integer | array}
 * @return {array}
 */
export default delayArg => {
  if (!isArray(delayArg)) {
    delayArg = [delayArg / 2, delayArg / 2];
  }

  return {
    before: delayArg[0],
    after: delayArg[1],
    total: delayArg[0] + delayArg[1]
  };
};
