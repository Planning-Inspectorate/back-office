import { readdirSync, readFileSync } from 'node:fs';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { setCache, getCache } from '#utils/cache-data.js';
import BackOfficeAppError from '#utils/app-error.js';

const SCHEMA_PATH = './src/message-schemas';

const loadSchemas = async () => {
	const cacheKey = 'integration-schemas';
	let schemas = getCache(cacheKey);
	if (!schemas) {
		schemas = readdirSync(SCHEMA_PATH)
			.filter((file) => file.endsWith('.schema.json'))
			.map((file) => {
				return JSON.parse(readFileSync(`${SCHEMA_PATH}/${file}`).toString());
			});

		setCache(cacheKey, schemas);
	}
	return schemas;
};

export const schemas = {
	appellantCase: 'pins-appellant-case',
	lpaQuestionnaire: 'pins-lpa-questionnaire',
	document: 'pins-document',
	appeal: 'pins-appeal'
};

export const validateFromSchema = async (
	/** @type {string} */ schema,
	/** @type {any} */ payload
) => {
	const schemas = await loadSchemas();
	const ajv = new Ajv({ schemas });
	addFormats(ajv);

	const validator = ajv.getSchema(`${schema}.schema.json`);
	if (!validator) {
		throw new BackOfficeAppError(
			`Trying to validate against schema '${schema}', which could not be loaded.`
		);
	}
	if (!validator(payload)) {
		return { errors: validator.errors };
	} else {
		return true;
	}
};
