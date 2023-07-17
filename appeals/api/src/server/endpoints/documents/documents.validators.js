import { composeMiddleware } from '@pins/express';
import { body } from 'express-validator';
import validateIdParameter from '#common/validators/id-parameter.js';
import validateGuidParameter from '#common/validators/guid-parameter.js';
import { validationErrorHandler } from '#middleware/error-handler.js';
import {
	ERROR_MUST_BE_STRING,
	ERROR_MUST_CONTAIN_AT_LEAST_1_VALUE,
	ERROR_MUST_BE_VALID_FILEINFO
} from '#endpoints/constants.js';

const getFolderIdValidator = composeMiddleware(
	validateIdParameter('folderId'),
	validationErrorHandler
);

const getDocumentIdValidator = composeMiddleware(
	validateGuidParameter('documentId'),
	validationErrorHandler
);

const getDocumentValidator = composeMiddleware(
	body('blobStorageHost').isString().withMessage(ERROR_MUST_BE_STRING),
	body('blobStorageContainer').isString().withMessage(ERROR_MUST_BE_STRING),
	body('document').isObject().withMessage(ERROR_MUST_BE_VALID_FILEINFO),
	validationErrorHandler
);

const getDocumentsValidator = composeMiddleware(
	body('blobStorageHost').isString().withMessage(ERROR_MUST_BE_STRING),
	body('blobStorageContainer').isString().withMessage(ERROR_MUST_BE_STRING),
	body('documents')
		.isArray()
		.custom((value) => value[0])
		.withMessage(ERROR_MUST_CONTAIN_AT_LEAST_1_VALUE),
	validationErrorHandler
);

export {
	getFolderIdValidator,
	getDocumentIdValidator,
	getDocumentValidator,
	getDocumentsValidator
};
