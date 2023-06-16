import api from '../back-office-api-client';
import run from '../index';
import { jest } from '@jest/globals';

describe('handle-subscription-command', () => {
	describe('create', () => {
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

	describe('delete', () => {
		const mockDate = new Date('2023-06-16T10:00Z');
		beforeEach(() => {
			jest.useFakeTimers();
			jest.setSystemTime(mockDate);
		});
		afterEach(() => {
			jest.useRealTimers();
		});

		const tests = [
			{
				name: 'should check for caseReference',
				msg: {
					applicationProperties: {
						type: 'Delete'
					},
					body: {}
				},
				log: {
					warn: `Ingoring invalid message, invalid caseReference`
				}
			},
			{
				name: 'should check for emailAddress',
				msg: {
					applicationProperties: {
						type: 'Delete'
					},
					body: {
						caseReference: '13334'
					}
				},
				log: {
					warn: `Ingoring invalid message, invalid emailAddress`
				}
			},
			{
				name: 'should try and fetch existing subscription',
				msg: {
					applicationProperties: {
						type: 'Delete'
					},
					body: {
						caseReference: '13334',
						emailAddress: 'user@example.com'
					}
				},
				existing: null,
				log: {
					warn: `Existing subscription not found`
				}
			},
			{
				name: 'should update existing subscription',
				msg: {
					applicationProperties: {
						type: 'Delete'
					},
					body: {
						caseReference: '13334',
						emailAddress: 'user@example.com'
					}
				},
				existing: { id: 1 },
				log: {
					info: `subscription updated to end now: 1, ${mockDate.toISOString()}`
				}
			}
		];

		api.getSubscription = jest.fn().mockResolvedValue({ id: 1 });
		api.updateSubscription = jest.fn().mockResolvedValue({ id: 1 });
		const context = {
			log: jest.fn()
		};
		context.log.info = jest.fn();
		context.log.warn = jest.fn();
		context.log.error = jest.fn();

		for (const { name, msg, log, existing } of tests) {
			it('' + name, async () => {
				if (existing !== undefined) {
					api.getSubscription.mockResolvedValueOnce(existing);
				}

				await run(context, msg);
				expect(context.log).toHaveBeenLastCalledWith('Handle subscription message', msg);
				// this is OK because we always run some checks
				/* eslint-disable jest/no-conditional-expect */
				if (log.warn) {
					expect(context.log.warn).toHaveBeenLastCalledWith(log.warn, msg);
				} else {
					expect(api.getSubscription).toHaveBeenLastCalledWith(
						msg.body.caseReference,
						msg.body.emailAddress
					);
					expect(api.updateSubscription).toHaveBeenLastCalledWith(existing?.id, {
						endDate: mockDate.toISOString()
					});
					expect(context.log.info).toHaveBeenLastCalledWith(log.info);
				}
				/* eslint-enable jest/no-conditional-expect */
			});
		}
	});
});
