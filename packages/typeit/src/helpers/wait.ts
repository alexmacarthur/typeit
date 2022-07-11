/**
 * Fire a callback after a delay, and add the timeout ID to a referenced array.
 */
let wait = (
  callback: Function,
  delay: number | undefined,
  timeouts: number[]
) => {
  return new Promise<void>((resolve) => {
    let cb = async () => {
      await callback();

      resolve();
    };

    timeouts.push(setTimeout(cb, delay || 0) as unknown as number);
  });
};

export default wait;
