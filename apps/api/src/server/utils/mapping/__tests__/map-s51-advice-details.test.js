import { mapS51AdviceStatusToSchemaStatus } from '#utils/mapping/map-s51-advice-details.js';

describe('mapS51AdviceStatusToSchemaStatus', () => {
	it.each([
		{ status: 'checked', expected: 'checked' },
		{ status: 'not_checked', expected: 'unchecked' },
		{ status: 'ready_to_publish', expected: 'readytopublish' },
		{ status: 'published', expected: 'published' },
		{ status: 'do_not_publish', expected: 'donotpublish' }
	])('maps "$status" to "$expected" correctly', ({ status, expected }) => {
		expect(mapS51AdviceStatusToSchemaStatus(status)).toBe(expected);
	});

	it('throws an error if status does not exist', () => {
		expect(() => mapS51AdviceStatusToSchemaStatus('unknown_status')).toThrow(
			'Unknown S51 Advice Status: "unknown_status"'
		);
	});
});
