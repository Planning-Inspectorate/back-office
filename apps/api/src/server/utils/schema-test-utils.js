import Ajv from 'ajv';
import addAjvFormats from 'ajv-formats';
import { loadAllSchemas } from 'pins-data-model';

const { schemas } = await loadAllSchemas();

const ajv = new Ajv({ schemas, allErrors: true });

addAjvFormats(ajv);

export const validateNsipProjectSchema = ajv.getSchema('nsip-project.schema.json');
export const validateNsipDocumentSchema = ajv.getSchema('nsip-document.schema.json');

// AJV treats Date objects as objects, we need it to understand strings.
// We actually don't care about the date object because it gets serialsied as a string anyway, so we can validate JSON.Parse here.
export const validateNsipProject = (/** @type {any} */ payload) => {
	return (
		validateNsipProjectSchema && validateNsipProjectSchema(JSON.parse(JSON.stringify(payload)))
	);
};

export const validateNsipDocument = (/** @type {any} */ payload) => {
	return (
		validateNsipDocumentSchema && validateNsipDocumentSchema(JSON.parse(JSON.stringify(payload)))
	);
};

export const removeUndefined = (/** @type {any} */ payload) => {
	return JSON.parse(JSON.stringify(payload));
};
