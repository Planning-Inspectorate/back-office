import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { readdirSync, readFileSync } from 'node:fs';

const schemas = readdirSync('./src/message-schemas/events').map((file) => {
	return JSON.parse(readFileSync(`./src/message-schemas/events/${file}`).toString());
});

const ajv = new Ajv({ schemas });

addFormats(ajv);

export const validate = ajv.getSchema('nsip-project.schema.json');

// export const validate = ajv.compile(nsipProjectSchema);

// AJV treats Date objects as objects, we need it to understand strings.
// We actually don't care about the date object because it gets serialsied as a string anyway, so we can validate JSON.Parse here.
export const validateNsipProject = (/** @type {any} */ payload) => {
	return validate && validate(JSON.parse(JSON.stringify(payload)));
};

export const removeUndefined = (/** @type {any} */ payload) => {
	return JSON.parse(JSON.stringify(payload));
};
