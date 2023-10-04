import pino from '#utils/logger.js';
import { databaseConnector } from '#utils/database-connector.js';
import { schemas, validateFromSchema } from './integrations.validators.js';
import {
	ERROR_NOT_FOUND,
	ERROR_INVALID_APPELLANT_CASE_DATA,
	ERROR_INVALID_LPAQ_DATA,
	ERROR_INVALID_DOCUMENT_DATA
} from '#endpoints/constants.js';

/**
 * @type {import("express").RequestHandler}
 * @returns {Promise<object|void>}
 */
export const validateAppellantCase = async (req, res, next) => {
	const { body } = req;

	pino.info('Received appellant case from topic', body);
	const validationResult = await validateFromSchema(schemas.appellantCase, body);
	if (validationResult !== true && validationResult.errors) {
		const errorDetails = validationResult.errors.map(
			(e) => `${e.instancePath || '/'}: ${e.message}`
		);

		pino.error('Error validating appellant case', errorDetails);
		return res.status(400).send({
			errors: {
				integration: ERROR_INVALID_APPELLANT_CASE_DATA,
				details: errorDetails
			}
		});
	}

	next();
};

/**
 * @type {import("express").RequestHandler}
 * @returns {Promise<object|void>}
 */
export const validateLpaQuestionnaire = async (req, res, next) => {
	const { body } = req;

	pino.info('Received LPA questionnaire from topic', body);
	const validationResult = await validateFromSchema(schemas.lpaQuestionnaire, body);
	if (validationResult !== true && validationResult.errors) {
		const errorDetails = validationResult.errors.map(
			(e) => `${e.instancePath || '/'}: ${e.message}`
		);

		pino.error('Error validating LPA questionnaire', errorDetails);
		return res.status(400).send({
			errors: {
				integration: ERROR_INVALID_LPAQ_DATA,
				details: errorDetails
			}
		});
	}

	const appealExists = await findAppealByReference(body?.questionnaire?.caseReference);
	if (!appealExists) {
		pino.error(
			`Error associating LPA questionnaire to an existing appeal with reference '${body?.questionnaire?.caseReference}'`
		);
		return res.status(404).send({
			errors: {
				appeal: ERROR_NOT_FOUND
			}
		});
	}

	next();
};

/**
 * @type {import("express").RequestHandler}
 * @returns {Promise<object|void>}
 */
export const validateDocument = async (req, res, next) => {
	const { body } = req;

	pino.info('Received document from topic');
	const validationResult = await validateFromSchema(schemas.document, body);
	if (validationResult !== true && validationResult.errors) {
		const errorDetails = validationResult.errors.map(
			(e) => `${e.instancePath || '/'}: ${e.message}`
		);

		pino.error('Error validating document', errorDetails);
		return res.status(400).send({
			errors: {
				integration: ERROR_INVALID_DOCUMENT_DATA,
				details: errorDetails
			}
		});
	}

	const appealExists = await findAppealByReference(body?.caseRef);
	if (!appealExists) {
		pino.error(
			`Error associating document to an existing appeal with reference '${body?.caseRef}'`
		);
		return res.status(404).send({
			errors: {
				appeal: ERROR_NOT_FOUND
			}
		});
	}

	next();
};

const findAppealByReference = async (/** @type {string|undefined} */ reference) => {
	if (reference) {
		const appeal = await databaseConnector.appeal.findUnique({
			where: { reference }
		});
		if (appeal) {
			return appeal;
		}
	}

	return null;
};
