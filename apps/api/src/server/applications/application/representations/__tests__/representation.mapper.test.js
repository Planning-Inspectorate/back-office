import { formatContactDetails } from '../representation.mapper.js';

describe('formatContactDetails', () => {
	// Positive test: valid fields and values
	it('should trim and accept only valid string fields', () => {
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

	// Negative test: non-string fields should be left unchanged
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

	// Test: missing fields
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

	// Test: empty input
	it('should return an empty object for empty input', () => {
		// GIVEN
		const contact = {};

		// WHEN
		const result = formatContactDetails(contact);

		// THEN
		expect(result).toEqual({});
	});

	// Negative test: ignore fields not in the allowed list
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

	// Negative test: invalid fields and values for schema
	it('should ignore fields not matching schema and trim valid ones', () => {
		// GIVEN
		const contact = {
			organisationName: '  Org Name  ',
			firstName: '  John  ',
			badFieldThatDoesNotExistOnSchema: 'bad',
			origin: 'badOriginFieldThatDoesNotMatchEnum',
			redactedStatus: 'badFieldThatDoesNotMatchEnum',
			published: 1233
		};

		// WHEN
		const result = formatContactDetails(contact);

		// THEN
		expect(result).toEqual({
			organisationName: 'Org Name',
			firstName: 'John'
		});
	});
});
