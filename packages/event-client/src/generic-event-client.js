// Generic class for service bus event messaging
import Ajv from 'ajv';
import addAjvFormats from 'ajv-formats';
import { loadAllSchemas } from 'pins-data-model';

const NSIP_S51_ADVICE = 'nsip-s51-advice';
const DEADLINE_SUBMISSION_TOPIC = 'deadline-submission-topic';

/**
 *
 */
export class GenericEventClient {
	/**
	 *
	 * @param {import('./event-client').Logger} logger
	 */
	constructor(logger) {
		this.logger = logger;
	}

	/**
	 * validates event payload to schema
	 *
	 * @param {string} topic
	 * @param {any[]} events
	 * @param {import('./event-type.js').EventType} eventType
	 * @param {Object.<string,any>?} [additionalProperties={}]
	 * @returns {Promise<boolean>}
	 */
	validateEventsToSchema = async (topic, events, eventType, additionalProperties = {}) => {
		if (events?.length < 1) {
			throw Error(`No events provided for type ${eventType} and topic ${topic}`);
		}

		// validate the payload against the schema
		const schemaName = getSchemaNameFromTopic(topic);

		const isAllValid = await this.validateMessageToSchema(schemaName, events);
		if (!isAllValid) {
			this.logger.info(
				`Message fails schema validation on ${topic} - no events broadcast for ${JSON.stringify(
					events
				)} with type ${eventType}, additional properties ${JSON.stringify(
					additionalProperties
				)} to topic ${topic}`
			);
		}

		return isAllValid;
	};

	/**
	 * validate that a service bus event message payload is valid to the matching schema in data-model repo
	 *
	 * @param {string} schemaName
	 * @param {object} events
	 * @returns {Promise<boolean>}
	 */
	validateMessageToSchema = async (schemaName, events) => {
		const { schemas, commands } = await loadAllSchemas();
		const allSchemas = { ...schemas, ...commands };

		const ajv = new Ajv({
			schemas: allSchemas,
			allErrors: true,
			verbose: true
		});

		addAjvFormats(ajv);

		const schema = allSchemas[schemaName];
		if (!schema) {
			console.error(`No valid schema found for '${schemaName}'`);
			return false;
		}

		const validator = ajv.compile(schema);
		const eventsToValidate = events instanceof Array ? events : [events];

		const isAllValid = eventsToValidate.every((e) => validator(e));

		if (!isAllValid) {
			console.error(
				`Message fails schema validation ${schemaName}: `,
				validator.errors?.map(
					({ instancePath, keyword, message, params }) =>
						`${instancePath}: keyword:${keyword} - ${message} - params:${JSON.stringify(params)}`
				)
			);
		}

		return isAllValid;
	};
}

/**
 * gets the name of the schema matching the topic
 *
 * @param {string} topic
 * @returns {string}
 */
export const getSchemaNameFromTopic = (topic) => {
	switch (topic) {
		case NSIP_S51_ADVICE:
			return 's51-advice.schema.json';
		case DEADLINE_SUBMISSION_TOPIC:
			return 'new-deadline-submission.schema.json';
		default:
			return topic + '.schema.json';
	}
};
