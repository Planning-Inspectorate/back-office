import { formatNameOrg } from '../format-name-org';

describe('formatNameOrg', () => {
	it('should return all if first name, last name, and organisation are available', () => {
		const result = formatNameOrg({ firstName: 'John', lastName: 'Doe', organisation: 'Acme Corp' });
		expect(result).toBe('John Doe, Acme Corp');
	});

	it('should return first name and last name only if no organisation provided', () => {
		const result = formatNameOrg({ firstName: 'John', lastName: 'Doe' });
		expect(result).toBe('John Doe');
	});

	it('should return organisation if only organisation is provided', () => {
		const result = formatNameOrg({ organisation: 'Acme Corp' });
		expect(result).toBe('Acme Corp');
	});

	it('should return an empty string if no parameters are provided', () => {
		const result = formatNameOrg({});
		expect(result).toBe('');
	});
});
