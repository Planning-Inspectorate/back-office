import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { readdirSync, readFileSync } from 'node:fs';

/**
 * @param {string} model
 * @returns {Promise<import('ajv').ValidateFunction>}
 */
export async function loadSchemaValidator(model) {
	const schemas = readdirSync('./src/message-schemas/events')
		.filter((file) => file.endsWith('.schema.json'))
		.map((file) => {
			return JSON.parse(readFileSync(`./src/message-schemas/events/${file}`).toString());
		});

	const ajv = new Ajv({ schemas, allErrors: true });

	addFormats(ajv);

	ajv.addVocabulary(['example']);

	const validator = ajv.getSchema(`${model}.schema.json`);
	if (!validator) {
		throw new Error(`no schema for ${model} found`);
	}
	return validator;
}

/**
 * @param {import('ajv').ErrorObject[]|null} [errors]
 * @returns {string}
 */
export function summariseErrors(errors) {
	return errors?.map(summariseError).join('; ') || '';
}

/**
 *
 * @param {import('ajv').ErrorObject} error
 */
function summariseError(error) {
	return [
		error.keyword,
		`"${error.instancePath.replace('/', '').replaceAll('/', '.')}"`,
		error.message,
		error.data && JSON.stringify(error.data)
	]
		.filter(Boolean)
		.join(' ');
}
