import { EventType } from './event-type.js';

describe('event-type', () => {
	it('should export an object with event types', () => {
		expect(EventType).toBeDefined();
		expect(typeof EventType).toBe('object');
		expect(EventType.Create).toBe('Create');
		expect(EventType.Update).toBe('Update');
		expect(EventType.Delete).toBe('Delete');
		expect(EventType.Publish).toBe('Publish');
		expect(EventType.Unpublish).toBe('Unpublish');
	});
});
