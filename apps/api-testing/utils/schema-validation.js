// @ts-nocheck
import Ajv from 'ajv';
import { Logger } from './logger.js';

const logger = new Logger();

/**
 *
 * @param {object} schema
 * @param {object} responseBody
 * @returns {boolean}
 */
export async function validateSchema(schema, responseBody) {
	const ajv = new Ajv({
		strict: false,
		allErrors: true,
		verbose: true,
		formats: {
			int64: /^\d+$/,
			int32: /^\d+$/
		}
	});

	const validate = await ajv.compile(schema);

	const valid = validate(responseBody);

	if (!valid) logger.error(`Schema Validation Error: \n${JSON.stringify(validate.errors)}`);

	return valid;
}
