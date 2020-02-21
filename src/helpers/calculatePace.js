import randomInRange from "../helpers/randomInRange";

export default function(typeSpeed, deleteSpeed, lifeLike) {
  deleteSpeed = deleteSpeed !== null ? deleteSpeed : typeSpeed / 3;
  let typeRange = typeSpeed / 2;
  let deleteRange = deleteSpeed / 2;

  return lifeLike
    ? [
        randomInRange(typeSpeed, typeRange),
        randomInRange(deleteSpeed, deleteRange)
      ]
    : [typeSpeed, deleteSpeed];
}
