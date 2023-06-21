import { jest } from '@jest/globals';

/** @typedef {{ restore: () => void }} DateMock */

/**
 * @param {Date} date
 * @returns {DateMock}
 */
export const installFixedDate = (date) => {
	jest.useFakeTimers({
		doNotFake: [
			'hrtime',
			'nextTick',
			'performance',
			'queueMicrotask',
			'requestAnimationFrame',
			'cancelAnimationFrame',
			'requestIdleCallback',
			'cancelIdleCallback',
			'setImmediate',
			'clearImmediate',
			'setInterval',
			'clearInterval',
			'setTimeout',
			'clearTimeout'
		]
	});
	jest.setSystemTime(date);

	return {
		restore: () => jest.useRealTimers()
	};
};
