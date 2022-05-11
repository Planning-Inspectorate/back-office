import { validationResult } from 'express-validator';

export const handleValidationError = function(request, response, next) {
	const result = validationResult(request).formatWith(({ msg }) => msg);

	if (!result.isEmpty()) {
		response.status(400).send({ errors: result.mapped() });
	} else {
		next();
	}
};
