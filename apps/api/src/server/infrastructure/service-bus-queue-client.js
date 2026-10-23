import { ServiceBusClient } from '@azure/service-bus';
import { DefaultAzureCredential } from '@azure/identity';
import chalk from 'chalk';
import config from '../config/config.js';
import logger from '../utils/logger.js';
import {
	EXAMINATION_LIBRARY_PUBLISH_QUEUE,
	EXAMINATION_LIBRARY_UNPUBLISH_QUEUE
} from './queues.js';
import {
	validateExaminationLibraryPublishPayload,
	validateExaminationLibraryUnpublishPayload
} from './payload-builders/examination-library.js';

/**
 * Mapping of queue names to their corresponding payload validator functions.
 * @type {Record<string, (payload: any) => any>}
 */
export const queueValidators = {
	[EXAMINATION_LIBRARY_PUBLISH_QUEUE]: validateExaminationLibraryPublishPayload,
	[EXAMINATION_LIBRARY_UNPUBLISH_QUEUE]: validateExaminationLibraryUnpublishPayload
};

/**
 * Validates a message payload according to the queue it is being sent to.
 *
 * @param {string} queueName
 * @param {any} body
 * @returns {any}
 */
export const validateQueuePayload = (queueName, body) => {
	const validator = queueValidators[queueName];
	if (typeof validator === 'function') {
		return validator(body);
	}
	return body;
};

export class ServiceBusQueueClient {
	/**
	 * @param {import('pino').Logger} [clientLogger]
	 * @param {string} [serviceBusHostname]
	 */
	constructor(clientLogger = logger, serviceBusHostname = config.serviceBusOptions?.hostname) {
		this.logger = clientLogger;
		this.client = new ServiceBusClient(serviceBusHostname, new DefaultAzureCredential(), {
			retryOptions: { maxRetries: 3 }
		});
	}

	/**
	 * Sends a message to a Service Bus queue, validating beforehand.
	 *
	 * @param {string} queueName
	 * @param {object} body
	 * @returns {Promise<void>}
	 */
	sendToQueue = async (queueName, body) => {
		validateQueuePayload(queueName, body);

		const sender = this.client.createSender(queueName);

		try {
			await sender.sendMessages({
				body,
				contentType: 'application/json'
			});
			this.logger.info({ queueName }, 'Dispatched message to Service Bus queue');
		} finally {
			await sender.close();
		}
	};
}

export class LocalQueueClient {
	/**
	 * @param {import('pino').Logger} [clientLogger]
	 */
	constructor(clientLogger = logger) {
		this.logger = clientLogger;
	}

	/**
	 * Dummy sends a message to a queue by validating and logging locally.
	 *
	 * @param {string} queueName
	 * @param {object} body
	 * @returns {Promise<void>}
	 */
	sendToQueue = async (queueName, body) => {
		validateQueuePayload(queueName, body);

		console.info(
			chalk.green(`Dummy dispatching message ${JSON.stringify(body)} to queue ${queueName}`)
		);
	};
}

/**
 * Returns either a real ServiceBusQueueClient or a LocalQueueClient.
 *
 * @param {boolean} [serviceBusEnabled]
 * @param {import('pino').Logger} [clientLogger]
 * @param {string} [serviceBusHostname]
 * @returns {ServiceBusQueueClient | LocalQueueClient}
 */
export const getQueueClient = (
	serviceBusEnabled = config.serviceBusEnabled,
	clientLogger = logger,
	serviceBusHostname = config.serviceBusOptions?.hostname
) => {
	return serviceBusEnabled
		? new ServiceBusQueueClient(clientLogger, serviceBusHostname)
		: new LocalQueueClient(clientLogger);
};

export const queueClient = getQueueClient();

/**
 * Dispatches a message to a Service Bus queue, validating the payload beforehand.
 *
 * @param {string} queueName
 * @param {object} body
 * @returns {Promise<void>}
 */
export const sendToQueue = async (queueName, body) => {
	return queueClient.sendToQueue(queueName, body);
};
