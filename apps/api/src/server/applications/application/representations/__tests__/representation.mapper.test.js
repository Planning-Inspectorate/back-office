import { formatContactDetails } from '../representation.mapper.js';

describe('formatContactDetails', () => {
	it('should trim string fields', () => {
		// GIVEN
		const contact = {
			organisationName: '  Org Name  ',
			firstName: '  John  ',
			lastName: '  Doe  ',
			email: '  john.doe@example.com  ',
			phoneNumber: '  1234567890  '
		};

		// WHEN
		const result = formatContactDetails(contact);

		// THEN
		expect(result).toEqual({
			organisationName: 'Org Name',
			firstName: 'John',
			lastName: 'Doe',
			email: 'john.doe@example.com',
			phoneNumber: '1234567890'
		});
	});

	it('should leave non-string fields unchanged', () => {
		// GIVEN
		const contact = {
			under18: true,
			phoneNumber: 1234567890
		};

		// WHEN
		const result = formatContactDetails(contact);

		// THEN
		expect(result).toEqual({
			under18: true,
			phoneNumber: 1234567890
		});
	});

	it('should handle missing fields gracefully', () => {
		// GIVEN
		const contact = {
			organisationName: '  Org Name  '
		};

		// WHEN
		const result = formatContactDetails(contact);

		// THEN
		expect(result).toEqual({
			organisationName: 'Org Name'
		});
	});

	it('should return an empty object for empty input', () => {
		// GIVEN
		const contact = {};

		// WHEN
		const result = formatContactDetails(contact);

		// THEN
		expect(result).toEqual({});
	});

	it('should ignore fields not in the allowed list', () => {
		// GIVEN
		const contact = {
			organisationName: '  Org Name  ',
			extraField: 'Should be ignored'
		};

		// WHEN
		const result = formatContactDetails(contact);

		// THEN
		expect(result).toEqual({
			organisationName: 'Org Name'
		});
	});
});
