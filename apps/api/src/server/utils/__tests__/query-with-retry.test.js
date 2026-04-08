import { jest } from '@jest/globals';
import { withRetry } from '../query-with-retry.js';

describe('withRetry', () => {
	const mockQuery = jest.fn();
	const mockSleep = jest.spyOn(global, 'setTimeout').mockImplementation((fn) => fn());

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('returns result on first successful query', async () => {
		mockQuery.mockResolvedValue('success');

		await expect(withRetry(mockQuery)).resolves.not.toThrow();

		expect(mockQuery).toHaveBeenCalledTimes(1);
	});

	it('retries on retryable errors and succeeds', async () => {
		mockQuery.mockRejectedValueOnce({ code: 'P1001' });

		await withRetry(mockQuery);

		expect(mockQuery).toHaveBeenCalledTimes(2);
	});

	it('throws the last error after max attempts', async () => {
		mockQuery.mockRejectedValue({ code: 'P1001' });

		await expect(withRetry(mockQuery, { maxAttempts: 3 })).rejects.toEqual({ code: 'P1001' });

		expect(mockQuery).toHaveBeenCalledTimes(3);
	});

	it('does not retry on non-retryable errors', async () => {
		mockQuery.mockRejectedValue(new Error('Non-retryable error'));

		await expect(withRetry(mockQuery)).rejects.toThrow('Non-retryable error');

		expect(mockQuery).toHaveBeenCalledTimes(1);
	});

	it('respects the maximum delay between retries', async () => {
		mockQuery
			.mockRejectedValueOnce({ code: 'P1001' })
			.mockRejectedValueOnce({ code: 'P1001' })
			.mockResolvedValueOnce('success');

		await withRetry(mockQuery, { baseDelayMs: 100, maxDelayMs: 150 });

		expect(mockSleep).toHaveBeenCalledTimes(2);
	});
});
