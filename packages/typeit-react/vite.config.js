import { defineConfig } from "vite";
import path from "path";

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
});
