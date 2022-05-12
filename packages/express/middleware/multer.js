import { checkSchema } from 'express-validator';
import { MulterError } from 'multer';

/** @type {import('express').ErrorRequestHandler} */
export const mapMulterErrorToValidationError = async (error, request, _, next) => {
	if (error instanceof MulterError && error.field) {
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

/**
 * Append any files parsed by the multer middleware back to the `req.body`: By
 * default, such that all parsed multipart formdata (not just fields) exists on
 * the body.
 *
 * @type {import('express').RequestHandler}
 */
const appendMulterFilesToRequestBody = (req, _, next) => {
	if (req.file) {
		req.body[req.file.fieldname] = req.file;
	}
	if (Array.isArray(req.files)) {
		for (const file of req.files) {
			req.body[file.fieldname] ??= [];
			req.body[file.fieldname].push(file);
		}
	} else if (req.files) {
		for (const [fieldname, file] of Object.entries(req.files)) {
			req.body[fieldname] = file;
		}
	}
	next();
};

/** @type {(import('express').ErrorRequestHandler | import('express').RequestHandler)[]} */
export const handleMulterRequest = [
	mapMulterErrorToValidationError,
	appendMulterFilesToRequestBody
];
