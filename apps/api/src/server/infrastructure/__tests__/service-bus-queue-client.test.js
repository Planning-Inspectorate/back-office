// @ts-nocheck
import { jest } from '@jest/globals';
import chalk from 'chalk';
import {
	ServiceBusQueueClient,
	LocalQueueClient,
	getQueueClient
} from '../service-bus-queue-client.js';
import { EXAMINATION_LIBRARY_PUBLISH_QUEUE } from '../queues.js';

describe('service-bus-queue-client', () => {
	let mockLogger;

	beforeEach(() => {
		mockLogger = { info: jest.fn() };
	});

	describe('LocalQueueClient', () => {
		it('should validate payload and log dummy dispatch in green', async () => {
			const consoleSpy = jest.spyOn(console, 'info').mockImplementation(() => {});
			const client = new LocalQueueClient(mockLogger);
			await client.sendToQueue('unknown-queue', { test: 123 });

			expect(consoleSpy).toHaveBeenCalledWith(
				chalk.green('Dummy dispatching message {"test":123} to queue unknown-queue')
			);
			consoleSpy.mockRestore();
		});

		it('should throw if payload fails validation', async () => {
			const client = new LocalQueueClient(mockLogger);
			await expect(
				client.sendToQueue(EXAMINATION_LIBRARY_PUBLISH_QUEUE, { invalid: 'payload' })
			).rejects.toThrow('Case reference is required');
		});
	});

	describe('ServiceBusQueueClient', () => {
		it('should dispatch message and close sender', async () => {
			const client = new ServiceBusQueueClient(mockLogger, 'test.servicebus.windows.net');
			const mockSendMessages = jest.fn().mockResolvedValue();
			const mockClose = jest.fn().mockResolvedValue();
			client.client.createSender = jest.fn().mockReturnValue({
				sendMessages: mockSendMessages,
				close: mockClose
			});

			await client.sendToQueue('unknown-queue', { foo: 'bar' });

			expect(mockSendMessages).toHaveBeenCalledWith({
				body: { foo: 'bar' },
				contentType: 'application/json'
			});
			expect(mockClose).toHaveBeenCalledTimes(1);
		});
	});

	describe('getQueueClient', () => {
		it('should return correct client based on serviceBusEnabled', () => {
			expect(getQueueClient(true, mockLogger, 'test')).toBeInstanceOf(ServiceBusQueueClient);
			expect(getQueueClient(false, mockLogger)).toBeInstanceOf(LocalQueueClient);
		});
	});
});
