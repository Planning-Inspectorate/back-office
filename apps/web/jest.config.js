export default {
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
};
