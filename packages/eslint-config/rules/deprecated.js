'use strict';

module.exports = {
	rules: {
		'valid-jsdoc': [
			'error',
			{
				'requireReturn': false,
				'requireParamDescription': false,
				'requireReturnDescription': false,
				'requireReturnType': true,
				'requireParamType': true
			}
		]
	}
};
