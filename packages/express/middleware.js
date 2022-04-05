import { MulterError } from 'multer';
import { checkSchema } from 'express-validator';

export const mapMulterErrorToValidationError = async (error, request, _, next) => {
	if (error instanceof MulterError) {
		await checkSchema({
			[error.field]: {
				custom: {
					errorMessage: error.message
				}
			}
		}).run(request);
		next();
	} else {
		next(error);
	}
};
