const pkg = require("./package.json");
import babel from "rollup-plugin-babel";
import { terser } from "rollup-plugin-terser";
import typescript from "@rollup/plugin-typescript";

const isProduction = process.env.NODE_ENV === "production";
const name = "TypeIt";

const preamble = `// TypeIt by Alex MacArthur - ${pkg.homepage}`;

const OUTPUT_DATA = [
  {
    file: pkg.main,
    format: "umd",
  },
  {
    file: pkg.module,
    format: "es",
  },
];

export default OUTPUT_DATA.map(({ file, format }) => {
  let plugins = [
    typescript(),
    babel({
      exclude: "node_modules/*",
      presets: [
        [
          "@babel/preset-env",
          {
            modules: false,
            targets:
              format === "es"
                ? { esmodules: true }
                : {
                    browsers: ["defaults"],
                  },
          },
        ],
      ],
      plugins: [
        "babel-plugin-transform-async-to-promises",
        [
          "@babel/plugin-transform-spread",
          {
            loose: true,
          },
        ],
      ],
    }),
  ];

  if (isProduction) {
    plugins.push(
      terser({
        output: {
          preamble,
        },
      })
    );
  }

  return {
    input: "./src/TypeIt.ts",
    output: { file, format, name },
    plugins,
  };
});
