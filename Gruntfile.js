/* jshint node:true  */

module.exports = function ( grunt ) {

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		meta: {
			banner: '/*! <%= pkg.name %> <%= pkg.version %> - <%= pkg.description %> | Author: <%= pkg.author %>, <%= grunt.template.today("yyyy") %> | License: <%= pkg.license %> */\n'
		},

		bump: {
			options: {
				files: ['package.json', 'bower.json'],
				updateConfigs: ['pkg'],
				commit: true,
				commitMessage: 'Release %VERSION%',
				commitFiles: ['-a'],
				createTag: true,
				tagName: '%VERSION%',
				tagMessage: '',
				push: false
			}
		},

		scsslint: {
			main: {
				options: {
					config: '.scss-lint.yml',
					colorizeOutput: true,
					force: true,
					compact: true
				},
				src: ['lib/**/*.scss']
			}
		},

		sass: {
			options: {
				style: 'expanded',
				sourcemap: 'none',
				loadPath: [
					'./',
					'node_modules/bourbon/dist'
				]
			},
			test: {
				files: [{
					expand: true,
					cwd: 'test/manual',
					src: ['**/*.scss'],
					dest: 'compiled/test/manual',
					ext: '.css'
				}]
			},
			bootcamp: {
				options: {
					loadPath: [
						'./',
						'node_modules/bourbon/dist',
						'node_modules/bootcamp/dist'
					]
				},
				files: {
					'compiled/test/test.css': 'test/test.scss'
				}
			}
		},

		bootcamp: {
			test: {
				files: {
					src: ['compiled/test/test.css']
				}
			}
		},

		concurrent: {
			options: {
				logConcurrentOutput: true
			},
			test: ['watch']
		},

		watch: {
			options: {
				spawn: false
			},
			sass: {
				files: ['<%= pkg.main %>', 'lib/**/*.scss'],
				tasks: ['sass:test']
			}
		},

	});

	require('load-grunt-tasks')(grunt);
	grunt.loadNpmTasks('bootcamp');

	grunt.registerTask('test', function () {
		var tasks = ['sass:test','sass:bootcamp','bootcamp'];
		if ( grunt.option('watch') ) {
			tasks.push('concurrent:test');
		}
		grunt.task.run(tasks);
	});

	grunt.registerTask('stylecheck', ['scsslint:main']);
	grunt.registerTask('default', ['stylecheck']);
	grunt.registerTask('releasePatch', ['bump-only:patch', 'default', 'bump-commit']);
	grunt.registerTask('releaseMinor', ['bump-only:minor', 'default', 'bump-commit']);
	grunt.registerTask('releaseMajor', ['bump-only:major', 'default', 'bump-commit']);

};
