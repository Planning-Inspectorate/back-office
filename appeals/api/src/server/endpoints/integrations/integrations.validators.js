import { readdirSync, readFileSync } from 'node:fs';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const SCHEMA_PATH = './src/message-schemas';
const loadSchemas = async () => {
	const schemas = await readdirSync(SCHEMA_PATH)
		.filter((file) => file.endsWith('.schema.json'))
		.map((file) => {
			return JSON.parse(readFileSync(`./src/message-schemas/${file}`).toString());
		});

	return schemas;
};
export const schemas = {
	appellantCase: 'appellant-case-submission',
	lpaQuestionnaire: 'questionnaire-submission',
	document: 'document'
};

export const validateFromSchema = async (
	/** @type {string} */ schema,
	/** @type {any} */ payload
) => {
	const schemas = await loadSchemas();
	const ajv = new Ajv({ schemas });
	addFormats(ajv);

	const validator = ajv.getSchema(`${schema}.schema.json`) || (() => false);
	if (!validator(payload)) {
		// @ts-ignore
		return { errors: validator.errors };
	} else {
		return true;
	}
};
