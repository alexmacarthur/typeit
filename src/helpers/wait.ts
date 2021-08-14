/**
 * Fire a callback after a delay, and add the timeout ID to a referenced array.
 */
const wait = async (callback: Function, delay: number, timeouts) => {
  return new Promise<void>((resolve) => {
    const cb = async () => {
      await callback();

      resolve();
    };

    timeouts.push(setTimeout(cb, delay) as unknown as number);
  });
};

export default wait;
