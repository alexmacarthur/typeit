export default (timeouts) => {
  timeouts.forEach(timeout => {
    clearTimeout(timeout);
  });

  return [];
}
