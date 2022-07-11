export default <T>(value: T, times: number): T[] =>
  new Array(times).fill(value);
