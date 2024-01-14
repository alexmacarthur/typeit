import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  test: {
    globals: true,
    setupFiles: "__tests__/setup.js",
    environment: "jsdom",
  },
  build: {
    minify: "terser",
    target: "esnext",
    lib: {
      entry: path.resolve(__dirname, "src/TypeIt.ts"),
      name: "TypeIt",
      fileName: (format) => `index.${format}.js`,
    },
  },
});
