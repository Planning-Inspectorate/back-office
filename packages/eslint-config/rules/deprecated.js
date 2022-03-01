'use strict';

module.exports = {
	rules: {
		'valid-jsdoc': [
			'error',
			{
				'requireReturn': false,
				'requireParamDescription': true,
				'requireReturnDescription': true,
				'requireReturnType': true,
				'requireParamType': true
			}
		]
	}
};
