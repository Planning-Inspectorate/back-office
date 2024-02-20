// import api from '../back-office-api-client.js';
// import run from '../index.js';
// import { jest } from '@jest/globals';
// import { redactEmailForLogs } from '../logging-utils.js';
//
// describe('handle-subscription-command', () => {
// 	/** @type {import('@azure/functions').Context} */
// 	const context = {
// 		log: jest.fn()
// 	};
// 	context.log.info = jest.fn();
//
// 	describe('create', () => {
// 		api.createOrUpdateSubscription = jest.fn().mockResolvedValue({ id: 1 });
// 		afterEach(() => context.log.info.mockReset());
//
// 		it('should handle no message type', async () => {
// 			await expect(run(context, {})).rejects.toEqual(
// 				new Error('Ignoring invalid message, no type')
// 			);
// 		});
//
// 		it('should handle invalid message type', async () => {
// 			const ctx = {
// 				...context,
// 				bindingData: {
// 					applicationProperties: {
// 						type: 'random-str'
// 					}
// 				}
// 			};
//
// 			await expect(run(ctx, {})).rejects.toThrow(
// 				new Error(`Ignoring invalid message, unsupported type 'random-str'`)
// 			);
// 		});
//
// 		it('should handle valid message', async () => {
// 			const ctx = {
// 				...context,
// 				bindingData: {
// 					applicationProperties: {
// 						type: 'Create'
// 					}
// 				}
// 			};
//
// 			const msg = {
// 				nsipSubscription: {
// 					caseReference: 'abc',
// 					emailAddress: 'fake@example.com'
// 				},
// 				subscriptionTypes: ['allUpdates']
// 			};
//
// 			await run(ctx, msg);
//
// 			expect(context.log).toHaveBeenLastCalledWith(
// 				'Handle subscription message',
// 				redactEmailForLogs(msg)
// 			);
// 			expect(context.log.info).toHaveBeenLastCalledWith(`subscription created/updated: 1`);
// 		});
// 	});
//
// 	describe('delete', () => {
// 		const mockDate = new Date('2023-06-16T10:00Z');
//
// 		api.getSubscription = jest.fn().mockResolvedValue({ id: 1 });
// 		api.updateSubscription = jest.fn().mockResolvedValue({ id: 1 });
//
// 		beforeEach(() => {
// 			jest.useFakeTimers();
// 			jest.setSystemTime(mockDate);
// 		});
// 		afterEach(() => {
// 			jest.useRealTimers();
// 		});
//
// 		it('should check for caseReference', async () => {
// 			const ctx = {
// 				...context,
// 				bindingData: {
// 					applicationProperties: {
// 						type: 'Delete'
// 					}
// 				}
// 			};
//
// 			const msg = {
// 				nsipSubscription: {}
// 			};
//
// 			await expect(run(ctx, msg)).rejects.toThrow(
// 				`Ignoring invalid message, invalid caseReference`
// 			);
//
// 			expect(context.log).toHaveBeenLastCalledWith(
// 				'Handle subscription message',
// 				redactEmailForLogs(msg)
// 			);
// 		});
//
// 		it('should check for emailAddress', async () => {
// 			const ctx = {
// 				...context,
// 				bindingData: {
// 					applicationProperties: {
// 						type: 'Delete'
// 					}
// 				}
// 			};
//
// 			const msg = {
// 				nsipSubscription: {
// 					caseReference: '13334'
// 				}
// 			};
//
// 			await expect(run(ctx, msg)).rejects.toThrow(`Ignoring invalid message, invalid emailAddress`);
//
// 			expect(context.log).toHaveBeenLastCalledWith(
// 				'Handle subscription message',
// 				redactEmailForLogs(msg)
// 			);
// 		});
//
// 		it('should try and fetch existing subscription', async () => {
// 			const ctx = {
// 				...context,
// 				bindingData: {
// 					applicationProperties: {
// 						type: 'Delete'
// 					}
// 				}
// 			};
//
// 			const msg = {
// 				nsipSubscription: {
// 					caseReference: '13334',
// 					emailAddress: 'user@example.com'
// 				}
// 			};
//
// 			api.getSubscription.mockResolvedValueOnce(null);
//
// 			await expect(run(ctx, msg)).rejects.toThrow(`Existing subscription not found`);
//
// 			expect(context.log).toHaveBeenLastCalledWith(
// 				'Handle subscription message',
// 				redactEmailForLogs(msg)
// 			);
// 		});
//
// 		it('should update existing subscription', async () => {
// 			const ctx = {
// 				...context,
// 				bindingData: {
// 					applicationProperties: {
// 						type: 'Delete'
// 					}
// 				}
// 			};
//
// 			const msg = {
// 				nsipSubscription: {
// 					caseReference: '13334',
// 					emailAddress: 'user@example.com'
// 				}
// 			};
// 			// api.getSubscription.mockResolvedValueOnce({ id: 1 });
// 			await run(ctx, msg)
//
// 			expect(api.getSubscription).toHaveBeenLastCalledWith(
// 				msg.nsipSubscription.caseReference,
// 				msg.nsipSubscription.emailAddress
// 			);
// 			expect(api.updateSubscription).toHaveBeenLastCalledWith(1, {
// 				endDate: mockDate.toISOString()
// 			});
// 			expect(context.log.info).toHaveBeenLastCalledWith(
// 				`subscription updated to end now: 1, ${mockDate.toISOString()}`
// 			);
// 			expect(context.log).toHaveBeenLastCalledWith(
// 				'Handle subscription message',
// 				redactEmailForLogs(msg)
// 			);
// 		});
// 	});
// });
