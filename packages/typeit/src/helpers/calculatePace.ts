import { Options } from "../types";
import randomInRange from "./randomInRange";

let range = (val: number): number => val / 2;

/**
 * [typePace, deletePace]
 */
export default function (options: Options): number[] {
  let { speed, deleteSpeed, lifeLike } = options;

  deleteSpeed = deleteSpeed !== null ? deleteSpeed : speed / 3;

  return lifeLike
    ? [
        randomInRange(speed, range(speed)),
        randomInRange(deleteSpeed, range(deleteSpeed)),
      ]
    : [speed, deleteSpeed];
}
