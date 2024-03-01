import Ajv from 'ajv';
import addAjvFormats from 'ajv-formats';
import { loadAllSchemas } from 'pins-data-model';
import { getSchemaNameFromTopic } from './event-client.js';

/**
 * @property {import('ajv/dist/types/index.js').AnyValidateFunction<unknown>} validator
 */

export class LocalEventClient {
	/**
	 *
	 * @param {import("./event-client").Logger} logger
	 */
	constructor(logger) {
		this.logger = logger;
	}

	sendEvents = async (
		/** @type {string} */ topic,
		/** @type {any[]} */ events,
		/** @type {import('./event-type.js').EventType}*/ type
	) => {
		if (events?.length < 1) {
			throw Error(`No events provided for type ${type} and topic ${topic}`);
		}

		// validate the payload against the schema
		const schemaName = getSchemaNameFromTopic(topic);

		const isAllValid = await validateMessageToSchema(schemaName, events);

		if (isAllValid) {
			console.log(
				`Dummy publishing events ${JSON.stringify(events)} with type ${type} to topic ${topic}`
			);
		} else {
			console.log(
				`Message fails schema validation on ${topic} - no dummy events broadcast for ${JSON.stringify(
					events
				)} with type ${type} to topic ${topic}`
			);
		}

		return events;
	};
}

/**
 * validate that a service bus event message payload is valid to the matching schema in data-model repo
 *
 * @param {string} schemaName
 * @param {object} events
 * @returns {Promise<boolean>}
 */
const validateMessageToSchema = async (schemaName, events) => {
	const { schemas } = await loadAllSchemas();
	const ajv = new Ajv({ schemas, allErrors: true, verbose: true });

	addAjvFormats(ajv);

	const schema = schemas[schemaName];

	if (!schema) {
		console.log(`No valid schema found for '${schemaName}'`);
		return false;
	}
	const validator = ajv.compile(schema);

	let isAllValid = true;
	const eventsToValidate = events instanceof Array ? events : [events];

	for (const eachEvent of eventsToValidate) {
		const isValid = validator(eachEvent);
		if (!isValid) {
			isAllValid = false;
			console.log(
				`Message in fails schema validation ${schemaName}: `,
				validator.errors?.map(
					({ instancePath, keyword, message, params }) =>
						`${instancePath}: keyword:${keyword} - ${message} - params:${JSON.stringify(params)}`
				)
			);
		}
	}

	return isAllValid;
};
