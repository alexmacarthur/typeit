export default (movementArg, currentCursorPosition, allChars) => {
  let isString = typeof movementArg === "string";
  let isMovingToEnd;
  let canKeepMoving = false;
  let numberOfSteps = movementArg * -1;

  if (isString) {
    isMovingToEnd = movementArg.toUpperCase() === "END";
    numberOfSteps = isMovingToEnd ? -1 : 1;
    canKeepMoving = isMovingToEnd
      ? currentCursorPosition + numberOfSteps > 0
      : currentCursorPosition + numberOfSteps < allChars.length;
  }

  return {
    isString,
    numberOfSteps,
    canKeepMoving
  };
};
