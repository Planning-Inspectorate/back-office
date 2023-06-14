import container from 'rhea';
import config from '../../../environment/config.js';
import logger from './logger.js';

const options = {
	host: config.serviceBusOptions.host,
	hostname: config.serviceBusOptions.hostname,
	reconnect_limit: config.serviceBusOptions.reconnect_limit,
	password: config.serviceBusOptions.password,
	port: config.serviceBusOptions.port,
	reconnect: config.serviceBusOptions.reconnect,
	transport: config.serviceBusOptions.transport,
	username: config.serviceBusOptions.username
};

/** @type {Object<string,string|undefined>} */ const reasonToQueueMap = {
	startedCase: config.queues.startedCaseQueue
};

/**
 *
 * @param {string} reason
 * @returns {string}
 */
const getQueueFromReason = (reason) => {
	const queue = reasonToQueueMap[reason];

	if (typeof queue === 'undefined') throw new Error('Unknown service bus message reason provided');
	return queue;
};

/**
 *
 * @param {object} message
 * @param {string} reason
 */
export const sendMessage = (message, reason) => {
	const queue = getQueueFromReason(reason);

	container.connect(options).open_sender(queue);

	container.once(
		'sendable',
		(
			/** @type {{ sender: { send: (arg0: { body: any; content_type: string; }) => void; }; }} */ context
		) => {
			context.sender.send({
				body: container.message.data_section(Buffer.from(JSON.stringify(message), 'utf8')),
				content_type: 'application/json'
			});
		}
	);

	container.on('accepted', (/** @type {{ connection: { close: () => void; }; }} */ context) => {
		context.connection.close();
	});

	container.on('error', (/** @type {any} */ error) => {
		logger.error(error);
	});

	container.on('disconnected', (/** @type {{ error: any; }} */ context) => {
		if (context.error) logger.error(context.error);
	});
};
