module.exports = function (config) {
	config.set({
		frameworks: ['jasmine', 'karma-typescript'],
		files: [
			{ pattern: 'karma.test.ts' },
			{ pattern: 'src/**/*.ts' }
		],

		preprocessors: {
    		"**/*.ts": ['karma-typescript']
		},
		reporters: [ 'mocha', 'karma-typescript' ],
		colors: true,
		logLevel: config.LOG_INFO,
		autoWatch: true,
		browsers: ['Chrome'],
	});
};
