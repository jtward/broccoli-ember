module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		dev:['broccoli:dev:serve'],
		test:['broccoli:test:serve'],
		dist:['broccoli:dist:build'],
		
		broccoli: {
			dist: {
				dest: 'www',
				env:'production'
			},

			dev: {
				env: 'development'
			},

			test: {
				env:'test'
			}
		}
	});

	grunt.loadNpmTasks('grunt-broccoli');
};