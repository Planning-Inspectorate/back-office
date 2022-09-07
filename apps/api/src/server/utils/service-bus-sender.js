import container from 'rhea';
import logger from './logger.js';

const options = { port: 5672 };

/**
 *
 * @param {object} message
 * @param {string} queue
 */
export const sendMessage = (message, queue) => {
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
