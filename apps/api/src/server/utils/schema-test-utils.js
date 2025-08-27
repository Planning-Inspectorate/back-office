import Ajv from 'ajv';
import addAjvFormats from 'ajv-formats';
import { loadAllSchemas } from '@planning-inspectorate/data-model';

import chalk from 'chalk';
import { allKeyDateNames } from '../applications/key-dates/key-dates.utils.js';
import { getSchemaNameFromTopic } from '@pins/event-client/src/generic-event-client.js';

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

export const mockSendEvents = async (
	/** @type {string} */ topic,
	/** @type {any[]} */ events,
	/** @type {import('@pins/event-client').EventType}*/ type,
	// eslint-disable-next-line no-unused-vars
	/** @type {Object} */ additionalProperties = {}
) => {
	if (events?.length < 1) {
		throw new Error(`No events provided for type ${type} and topic ${topic}`);
	}

	// validate the payload against the schema
	const schemaName = getSchemaNameFromTopic(topic);

	const errorMessages = await validateMessageToSchema(
		schemaName,
		buildPayloadEventsForSchema(topic, events)
	);

	if (errorMessages?.length) {
		const message =
			`Message fails schema validation on ${topic} - no dummy events broadcast for ${JSON.stringify(
				events
			)} with type ${type} to topic ${topic}\n` + errorMessages.join('\n');
		console.log(chalk.red(message));
		// throw new Error(message);
	} else {
		console.info(
			chalk.green(
				`Dummy publishing events ${JSON.stringify(events)} with type ${type} to topic ${topic}`
			)
		);
	}

	return events;
};

/**
 * validate that a service bus event message payload is valid to the matching schema in data-model repo
 * copy of the real fn in the event-client package
 *
 * @param {string} schemaName
 * @param {object} events
 * @returns {Promise<string[] | boolean>}
 */
export const validateMessageToSchema = async (schemaName, events) => {
	const { schemas } = await loadAllSchemas();
	const ajv = new Ajv({ schemas, allErrors: true, verbose: true });

	addAjvFormats(ajv);

	const schema = schemas[schemaName];

	if (!schema) {
		return [chalk.yellowBright(`No valid schema found for '${schemaName}'`)];
	}

	const validator = ajv.compile(schema);

	const errorMessages = [];
	const eventsToValidate = events instanceof Array ? events : [events];

	for (const eachEvent of eventsToValidate) {
		const isValid = validator(eachEvent);
		if (!isValid) {
			errorMessages.push(
				validator.errors
					?.map(
						({ instancePath = '/', keyword, message, params }) =>
							`${chalk.yellowBright(
								`${instancePath}: keyword:${keyword} - ${message} - params:${JSON.stringify(
									params
								)}`
							)}`
					)
					.join('\n')
			);
		}
	}

	return errorMessages.length ? errorMessages : true;
};

export const allNullifiedKeyDates = allKeyDateNames.reduce(
	(acc, next) => ({ ...acc, [next]: null }),
	{}
);

export const buildInclusionsFromQuery = (query) =>
	Object.keys(query?.include || {}).reduce((acc, next) => ({ ...acc, [next]: true }), {});

const removeUndefined = (/** @type {any} */ payload) => {
	return JSON.parse(JSON.stringify(payload));
};

/**
 * adds the next null value to the payload
 *
 * @param {object} payload
 * @param {string} nextPropName
 */
const payloadReducer = (payload, nextPropName) => {
	// @ts-ignore
	payload[nextPropName] = null;
	return payload;
};

/**
 * build a null filled basePayload for the schema matching the topic
 * and merge with the supplied events
 *
 * @param {string} topic
 * @param {object | object[]} events
 */
export const buildPayloadEventsForSchema = (topic, events = {}) => {
	const eventsArray = Array.isArray(events) ? events : [events];
	const schemaName = getSchemaNameFromTopic(topic);
	const schema = schemas[schemaName];
	const basePayload = schema.required.reduce(payloadReducer, {});
	return eventsArray.map((event) => ({ ...basePayload, ...removeUndefined(event) }));
};
