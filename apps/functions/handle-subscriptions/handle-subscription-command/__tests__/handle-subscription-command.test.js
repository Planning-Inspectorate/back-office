import api from '../back-office-api-client.js';
import run, { redactEmailForLogs } from '../index.js';
import { jest } from '@jest/globals';

describe('handle-subscription-command', () => {
	function setupContextLog(ctx) {
		ctx.log = jest.fn();
		ctx.log.info = jest.fn();
		ctx.log.warn = jest.fn();
		ctx.log.error = jest.fn();
	}

	describe('create', () => {
		const tests = [
			{
				name: 'should handle no message type',
				context: {},
				msg: {},
				log: {
					warn: 'Ingoring invalid message, no type'
				}
			},
			{
				name: 'should handle invalid message type',
				context: {
					bindingData: {
						applicationProperties: {
							type: 'random-str'
						}
					}
				},
				msg: {},
				log: {
					warn: `Ingoring invalid message, unsupported type 'random-str'`
				}
			},
			{
				name: 'should handle valid message',
				context: {
					bindingData: {
						applicationProperties: {
							type: 'Create'
						}
					}
				},
				msg: {
					nsipSubscription: {
						caseReference: 'abc',
						emailAddress: 'fake@example.com'
					},
					subscriptionTypes: ['allUpdates']
				},
				log: {
					info: `subscription created/updated: 1`
				}
			}
		];

		api.createOrUpdateSubscription = jest.fn().mockResolvedValue({ id: 1 });

		for (const { name, context, msg, log } of tests) {
			it('' + name, async () => {
				setupContextLog(context);
				await run(context, msg);
				expect(context.log).toHaveBeenLastCalledWith(
					'Handle subscription message',
					redactEmailForLogs(msg)
				);
				// this is OK because we always run some checks
				/* eslint-disable jest/no-conditional-expect */
				if (log.warn) {
					expect(context.log.warn).toHaveBeenLastCalledWith(log.warn, redactEmailForLogs(msg));
				} else {
					expect(api.createOrUpdateSubscription).toHaveBeenLastCalledWith({
						...msg.nsipSubscription,
						subscriptionTypes: msg.subscriptionTypes
					});
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
				context: {
					bindingData: {
						applicationProperties: {
							type: 'Delete'
						}
					}
				},
				msg: {
					nsipSubscription: {}
				},
				log: {
					warn: `Ingoring invalid message, invalid caseReference`
				}
			},
			{
				name: 'should check for emailAddress',
				context: {
					bindingData: {
						applicationProperties: {
							type: 'Delete'
						}
					}
				},
				msg: {
					nsipSubscription: {
						caseReference: '13334'
					}
				},
				log: {
					warn: `Ingoring invalid message, invalid emailAddress`
				}
			},
			{
				name: 'should try and fetch existing subscription',
				context: {
					bindingData: {
						applicationProperties: {
							type: 'Delete'
						}
					}
				},
				msg: {
					nsipSubscription: {
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
				context: {
					bindingData: {
						applicationProperties: {
							type: 'Delete'
						}
					}
				},
				msg: {
					nsipSubscription: {
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

		for (const { name, context, msg, log, existing } of tests) {
			it('' + name, async () => {
				setupContextLog(context);

				if (existing !== undefined) {
					api.getSubscription.mockResolvedValueOnce(existing);
				}

				await run(context, msg);
				expect(context.log).toHaveBeenLastCalledWith(
					'Handle subscription message',
					redactEmailForLogs(msg)
				);
				// this is OK because we always run some checks
				/* eslint-disable jest/no-conditional-expect */
				if (log.warn) {
					expect(context.log.warn).toHaveBeenLastCalledWith(log.warn, redactEmailForLogs(msg));
				} else {
					expect(api.getSubscription).toHaveBeenLastCalledWith(
						msg.nsipSubscription.caseReference,
						msg.nsipSubscription.emailAddress
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
