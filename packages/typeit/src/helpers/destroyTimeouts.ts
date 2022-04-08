export default (timeouts: number[]): [] => {
  timeouts.forEach(clearTimeout);

  return [];
};
