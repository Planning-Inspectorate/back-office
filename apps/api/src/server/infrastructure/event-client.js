import config from '../config/config.js';
import { LocalEventClient } from './local-event-client.js';
import { ServiceBusEventClient } from './service-bus-event-client.js';

export const eventClient = config.serviceBusEnabled
	? new ServiceBusEventClient()
	: new LocalEventClient();
