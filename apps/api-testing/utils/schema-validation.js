// @ts-nocheck
import Ajv from 'ajv';
import { Logger } from './logger.js';
import { expect } from 'chai';

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
	const isValid = validate(responseBody);
	if (!isValid) logger.error(JSON.stringify(validate.errors, null, 2));
	expect(isValid).to.be.true;
}
