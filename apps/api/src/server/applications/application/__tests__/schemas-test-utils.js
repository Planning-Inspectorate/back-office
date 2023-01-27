import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { readFileSync } from 'node:fs';

const ajv = new Ajv();

addFormats(ajv);

const nsipProjectSchema = JSON.parse(
	readFileSync('./src/event-schemas/nsip-project.schema.json').toString()
);

export const validate = ajv.compile(nsipProjectSchema);

// AJV treats Date objects as objects, we need it to understand strings.
// We actually don't care about the date object because it gets serialsied as a string anyway, so we can validate JSON.Parse here.
export const validateNsipProject = (/** @type {any} */ payload) => {
	return validate(JSON.parse(JSON.stringify(payload)));
};
