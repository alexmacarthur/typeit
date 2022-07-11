let beforePaint = (cb): Promise<any> => {
  return new Promise((resolve) => {
    requestAnimationFrame(async () => {
      resolve(await cb());
    });
  });
};

export default beforePaint;
