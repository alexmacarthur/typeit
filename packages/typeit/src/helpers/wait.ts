/**
 * Fire a callback after a delay, and add the timeout ID to a referenced array.
 */
let wait = async (callback: Function, delay: number, timeouts) => {
  return new Promise<void>((resolve) => {
    let cb = async () => {
      await callback();

      resolve();
    };

    timeouts.push(setTimeout(cb, delay) as unknown as number);
  });
};

export default wait;
