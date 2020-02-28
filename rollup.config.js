const pkg = require("./package.json");
import babel from "rollup-plugin-babel";
import { terser } from "rollup-plugin-terser";

const isProduction = process.env.NODE_ENV === "production";

const preamble = `/**
  * TypeIt - ${pkg.description}
  * Author: ${pkg.author}
  * Version: v${pkg.version}
  * License: ${pkg.license}
  * URL: ${pkg.homepage}
  */`;

const OUTPUT_DATA = [
  {
    file: pkg.main,
    format: "umd"
  },
  {
    file: pkg.module,
    format: "es"
  }
];

export default OUTPUT_DATA.map(({ file, format }) => {
  let plugins = [
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
                    browsers: [
                      "> 2%",
                      "Last 2 versions",
                      "safari >=9",
                      "not ie < 11"
                    ]
                  }
          }
        ]
      ],
      plugins: [
        "babel-plugin-transform-async-to-promises",
        [
          "@babel/plugin-transform-spread",
          {
            loose: true
          }
        ]
      ]
    })
  ];

  if (isProduction) {
    plugins.push(
      terser({
        include: [/^.+\.min\.js$/],
        output: {
          preamble
        }
      })
    );
  }

  return {
    input: "./src/TypeIt.js",
    output: {
      file,
      format,
      name: "TypeIt"
    },
    plugins
  };
});
