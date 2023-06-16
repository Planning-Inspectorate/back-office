import api from '../back-office-api-client';
import run from '../index';
import { jest } from '@jest/globals';

describe('handle-subscription-command', () => {
	const tests = [
		{
			name: 'should handle no message type',
			msg: {},
			log: {
				warn: 'Ingoring invalid message, no type'
			}
		},
		{
			name: 'should handle invalid message type',
			msg: {
				applicationProperties: {
					type: 'random-str'
				}
			},
			log: {
				warn: `Ingoring invalid message, unsupported type 'random-str'`
			}
		},
		{
			name: 'should handle valid message',
			msg: {
				applicationProperties: {
					type: 'Create'
				},
				body: {}
			},
			log: {
				info: `subscription created: 1`
			}
		}
	];

	api.createSubscription = jest.fn().mockResolvedValue({ id: 1 });
	const context = {
		log: jest.fn()
	};
	context.log.info = jest.fn();
	context.log.warn = jest.fn();
	context.log.error = jest.fn();

	for (const { name, msg, log } of tests) {
		it('' + name, async () => {
			await run(context, msg);
			expect(context.log).toHaveBeenLastCalledWith('Handle subscription message', msg);
			// this is OK because we always run some checks
			/* eslint-disable jest/no-conditional-expect */
			if (log.warn) {
				expect(context.log.warn).toHaveBeenLastCalledWith(log.warn, msg);
			} else {
				expect(api.createSubscription).toHaveBeenLastCalledWith(msg.body);
				expect(context.log.info).toHaveBeenLastCalledWith(log.info);
			}
			/* eslint-enable jest/no-conditional-expect */
		});
	}
});
