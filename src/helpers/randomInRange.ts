export default (value: number, range: number): number => {
  return Math.abs(
    Math.random() * (value + range - (value - range)) + (value - range)
  );
};
