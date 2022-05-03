export default /** @type {import('@jest/types').Config} */ ({
	setupFiles: ['<rootDir>/setupTests.js'],
	transform: {
		'\\.js$': [
			'babel-jest',
			{
				presets: [
					[
						'@babel/preset-env',
						{
							targets: {
								node: 'current'
							}
						}
					]
				]
			}
		]
	}
});
