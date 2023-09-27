import { composeMiddleware } from '@pins/express';
import { body } from 'express-validator';
import validateIdParameter from '#common/validators/id-parameter.js';
import validateUuidParameter from '#common/validators/uuid-parameter.js';
import { validationErrorHandler } from '#middleware/error-handler.js';
import {
	ERROR_DOCUMENT_REDACTION_STATUSES_MUST_BE_ONE_OF,
	ERROR_MUST_BE_STRING,
	ERROR_MUST_CONTAIN_AT_LEAST_1_VALUE,
	ERROR_MUST_BE_VALID_FILEINFO
} from '#endpoints/constants.js';
import validateDateParameter from '#common/validators/date-parameter.js';
import errorMessageReplacement from '#utils/error-message-replacement.js';
import { getDocumentRedactionStatusIds } from './documents.service.js';

/** @typedef {import('@pins/appeals.api').Appeals.UpdateDocumentsRequest} UpdateDocumentsRequest */

/**
 * @param {UpdateDocumentsRequest} documents
 * @returns {Promise<boolean>}
 */
const validateDocumentRedactionStatusIds = async (documents) => {
	const redactionStatusIds = await getDocumentRedactionStatusIds();
	const hasValidStatusIds = documents.every(({ redactionStatus }) =>
		redactionStatusIds.includes(redactionStatus)
	);

	if (!hasValidStatusIds) {
		throw new Error(
			errorMessageReplacement(ERROR_DOCUMENT_REDACTION_STATUSES_MUST_BE_ONE_OF, [
				redactionStatusIds.join(', ')
			])
		);
	}

	return true;
};

const getFolderIdValidator = composeMiddleware(
	validateIdParameter('folderId'),
	validationErrorHandler
);

const getDocumentIdValidator = composeMiddleware(
	validateUuidParameter({ parameterName: 'documentId' }),
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

const patchDocumentsValidator = composeMiddleware(
	validateIdParameter('appealId'),
	validateUuidParameter({ parameterName: 'documents.*.id', parameterType: body }),
	validateDateParameter({ parameterName: 'documents.*.receivedDate', isRequired: true }),
	body('documents').custom(validateDocumentRedactionStatusIds),
	validationErrorHandler
);

export {
	getDocumentIdValidator,
	getDocumentsValidator,
	getDocumentValidator,
	getFolderIdValidator,
	patchDocumentsValidator
};
