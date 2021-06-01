export default (timeouts: number[]): [] => {
  timeouts.forEach((timeout) => clearTimeout(timeout));

  return [];
};
