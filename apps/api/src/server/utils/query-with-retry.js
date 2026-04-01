const RETRYABLE_PRISMA_CODES = new Set([
	'P1001', // Can't reach database server
	'P1002', // Database server timed out
	'P1008', // Operations timed out
	'P1017', // Server closed connection
	'P2024', // Timed out fetching connection from pool
	'P2034' // Transaction conflict (write conflict/deadlock)
]);

const DEFAULT_RETRY_OPTIONS = {
	maxAttempts: 3,
	baseDelayMs: 100,
	maxDelayMs: 2000
};

export const isRetryableError = (error) => {
	if (error && typeof error === 'object') {
		if ('code' in error && typeof error.code === 'string') {
			return RETRYABLE_PRISMA_CODES.has(error.code);
		}
		if ('name' in error && error.name === 'PrismaClientInitializationError') {
			return true;
		}
	}
	return false;
};

const sleep = (ms) => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Wraps prisma query with retry logic for transient Prisma errors.
 * Uses exponential backoff between retries.
 *
 * @throws The last error if all retries are exhausted or if the error is not retryable
 */
export const withRetry = async (query, options = {}) => {
	const { maxAttempts, baseDelayMs, maxDelayMs } = { ...DEFAULT_RETRY_OPTIONS, ...options };

	let lastError;

	for (let attempt = 1; attempt <= maxAttempts; attempt++) {
		try {
			return await query();
		} catch (error) {
			lastError = error;

			if (!isRetryableError(error) || attempt === maxAttempts) {
				throw error;
			}

			const delay = Math.min(baseDelayMs * Math.pow(2, attempt - 1), maxDelayMs);
			await sleep(delay);
		}
	}

	throw lastError;
};
