module.exports = function(grunt) {

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		// chech our JS
		jshint: {
			options: {
				"bitwise": true,
				"browser": true,
				"curly": true,
				"eqeqeq": true,
				"eqnull": true,
				"esnext": true,
				"immed": true,
				"jquery": true,
				"latedef": true,
				"newcap": true,
				"noarg": true,
				"node": true,
				"strict": false,
				"trailing": true,
				"undef": true,
				"globals": {
					"jQuery": true,
					"alert": true
				}
			},
			all: [
				'gruntfile.js',
				'typeit.js'
			]
		},

		// concat and minify the JS
		uglify: {
			dist: {
				files: {
					'typeit.min.js': [
						'typeit.js'
					]
				}
			}
		},

		postcss: {
      options: {
        map: true,
        processors: [
          require('autoprefixer')({
              browsers: ['last 2 versions']
          })
        ]
      },
      dist: {
          src: 'typeit.css'
      }
    },

		// compile the sass
		sass: {
			dist: {
				options: {
					style: 'compressed'
				},
				files: {
					'style.css':'style.scss',
					'typeit.css':'typeit.scss'
				}
			}
		},

		// watch for changes
		watch: {
			grunt: {
				files: ['gruntfile.js'],
			},
			scss: {
				files: ['*.scss'],
				tasks: [
					'sass',
					'postcss'
				]
			},
			js: {
				files: [
					'<%= jshint.all %>'
				],
				tasks: [
					'jshint',
					'uglify'
				]
			}
		},

	});

	// load all npm's via matchdep
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // register the default tasks
	grunt.registerTask('default', [
		'jshint',
		'uglify',
		'sass',
		'postcss'
	]);

};
