import isArray from "./isArray";

/**
 * Given a delay value, form it into the type of object
 * that will be used by Instance().
 *
 * @param {integer | array}
 * @return {array}
 */
export default (delayArg: number | number[]): number[] => {
  if (!isArray(delayArg)) {
    delayArg = [(delayArg as number) / 2, (delayArg as number) / 2];
  }

  return delayArg as number[];
};
