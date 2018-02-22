import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'
import pkg from './package.json'

const banner = `/*!
 *
 *   ${pkg.name} - ${pkg.description}
 *   Author: ${pkg.author}
 *   Version: v${pkg.version}
 *   URL: ${pkg.homepage}
 *   License: ${pkg.license}
 *
 */`

const plugins = [
  babel({
    babelrc: false,
    presets: [
      [
        'env',
        {
          modules: false
        }
      ]
    ],
    plugins: ['external-helpers']
  })
]

export default [
  {
    input: 'src/typeit.js',
    plugins: plugins,
    output: [
      {
        file: 'dist/typeit.js',
        format: 'umd',
        name: 'TypeIt',
        banner: banner
      },
      {
        file: 'dist/typeit.es.js',
        format: 'es',
        banner: banner
      }
    ]
  },
  {
    input: 'src/typeit.js',
    plugins: plugins.concat([
      uglify({
        output: {
          comments: function(node, comment) {
            const text = comment.value
            const type = comment.type
            const line = comment.line
            if (type === 'comment2' && line === 1) {
              return /typeit/i.test(text)
            }
          }
        }
      })
    ]),
    output: {
      file: 'dist/typeit.min.js',
      format: 'umd',
      name: 'TypeIt',
      banner: banner
    }
  }
]
