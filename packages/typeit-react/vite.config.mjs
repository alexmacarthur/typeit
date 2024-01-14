import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    minify: "terser",
    lib: {
      entry: path.resolve(__dirname, "src/index.tsx"),
      name: "TypeIt",
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: "src/setup.ts",
  }
});
