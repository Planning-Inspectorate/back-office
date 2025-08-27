import Ajv from 'ajv';
import addAjvFormats from 'ajv-formats';
import { loadAllSchemas } from '@planning-inspectorate/data-model';

/**
 * @param {string} model
 * @returns {Promise<import('ajv').ValidateFunction>}
 */
export async function loadSchemaValidator(model) {
	const { schemas } = await loadAllSchemas();

	const ajv = new Ajv({
		schemas,
		// check all rules (don't stop at the first)
		allErrors: true
	});
	addAjvFormats(ajv);
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
