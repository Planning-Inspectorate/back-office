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

const { subscriber } = config.serviceBusOptions;
const queue = config.queues.startedCaseQueue;

const connection = container.connect(options);

connection.on('receiver_open', () => {
	logger.info('Subscribed');
});
connection.on('message', (context) => {
	if (context.message.body === 'detach') {
		// detaching leaves the subscription active, so messages sent
		// while detached are kept until we attach again
		context.receiver.detach();
		context.connection.close();
	} else if (context.message.body === 'close') {
		// closing cancels the subscription
		context.receiver.close();
		context.connection.close();
	} else {
		logger.info(JSON.parse(context.message.body.content.toString()));
	}
});
// the identity of the subscriber is the combination of container id
// and link (i.e. receiver) name
connection.open_receiver({
	name: subscriber,
	source: {
		address: queue,
		expiry_policy: 'never'
	}
});
