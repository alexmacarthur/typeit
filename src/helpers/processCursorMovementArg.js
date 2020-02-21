export default (movementArg, currentCursorPosition, allChars) => {
  let isString = typeof movementArg === "string";
  let isMovingToEnd;
  let canKeepMoving = false;
  let numberOfSteps = movementArg * -1;

  if (isString) {
    isMovingToEnd = movementArg.toUpperCase() === "END";

    if (isMovingToEnd) {
      numberOfSteps = -1;
      canKeepMoving = currentCursorPosition + numberOfSteps > 0;
    } else {
      numberOfSteps = 1;
      canKeepMoving = currentCursorPosition + numberOfSteps < allChars.length;
    }
  }

  return {
    isString,
    numberOfSteps,
    canKeepMoving
  };
};
