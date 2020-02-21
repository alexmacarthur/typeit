export default (value, range) => {
  return Math.abs(
    Math.random() * (value + range - (value - range)) + (value - range)
  );
}
