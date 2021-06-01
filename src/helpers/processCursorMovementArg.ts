import { Character } from "../types";

type ProcessResult = {
  isString: boolean;
  numberOfSteps: number;
  canKeepMoving: boolean;
}

export default (
  movementArg: number | string,
  currentCursorPosition: number,
  allChars: Character[]
): ProcessResult => {
  let isString = typeof movementArg === "string";
  let canKeepMoving = false;
  let numberOfSteps = movementArg as number * -1;

  if (isString) {
    let isMovingToEnd = (movementArg as string).toUpperCase() === "END";
    numberOfSteps = isMovingToEnd ? -1 : 1;
    canKeepMoving = isMovingToEnd
      ? currentCursorPosition + numberOfSteps > 0
      : currentCursorPosition + numberOfSteps < allChars.length;
  }

  return {
    isString,
    numberOfSteps,
    canKeepMoving,
  };
};
