import processCursorOptions from "../../src/helpers/processCursorOptions";

describe("a boolean is passed", () => {
  it("returns the defaults when it's true", () => {
    const result = processCursorOptions(true);

    expect(result).toEqual(
      expect.objectContaining({
        autoPause: true,
        autoPauseDelay: 500,
        animation: expect.anything(),
      })
    );
  });

  it("returns false when it's false", () => {
    const result = processCursorOptions(false);

    expect(result).toBe(false);
  });
});

describe("an object is passed", () => {
  describe("autoPause settings", () => {
    it("uses defaults", () => {
      const result = processCursorOptions({});

      expect(result.autoPause).toBe(true);
      expect(result.autoPauseDelay).toEqual(500);
    });

    it("uses custom values", () => {
      const result = processCursorOptions({
        autoPause: false,
        autoPauseDelay: 800,
      });

      expect(result.autoPause).toBe(false);
      expect(result.autoPauseDelay).toEqual(800);
    });
  });

  describe("animation frames", () => {
    it("uses default frames", () => {
      const result = processCursorOptions({
        animation: {},
      });

      expect(result.animation.options.iterations).toEqual(Infinity);
      expect(result.animation.frames).toEqual([
        { opacity: 0 },
        { opacity: 0 },
        { opacity: 1 },
      ]);
    });

    it("uses custom frames", () => {
      const result = processCursorOptions({
        animation: {
          frames: [
            { transform: "rotate(0)" },
            { transform: "rotate(0)" },
            { transform: "rotate(1)" },
          ],
        },
      });

      expect(result.animation.options.iterations).toEqual(Infinity);
      expect(result.animation.frames).toEqual([
        { transform: "rotate(0)" },
        { transform: "rotate(0)" },
        { transform: "rotate(1)" },
      ]);
    });
  });

  describe("animation options", () => {
    it("it uses defaults", () => {
      const result = processCursorOptions({
        animation: {
          options: {
            // iterations: Infinity,
          },
        },
      });

      expect(result.animation.options).toEqual(
        expect.objectContaining({
          iterations: Infinity,
          easing: "steps(2, start)",
          fill: "forwards",
        })
      );
    });
  });

  it("it uses custom values", () => {
    const result = processCursorOptions({
      animation: {
        options: {
          iterations: 2,
          fill: "backwards",
        },
      },
    });

    expect(result.animation.frames[0]).toEqual({
      opacity: 0,
    });
    expect(result.animation.options).toEqual(
      expect.objectContaining({
        iterations: 2,
        easing: "steps(2, start)",
        fill: "backwards",
      })
    );
  });
});
