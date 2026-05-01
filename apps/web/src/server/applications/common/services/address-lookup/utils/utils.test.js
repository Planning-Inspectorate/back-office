// @ts-nocheck
import capitalizeString from './capitalizeString.js';
import formatDisplayAddress from './formatAddress.js';

describe('Capitalize util function', () => {
	it('should capitalize any group of words', () => {
		const upperCaseString = 'A STRING WRITTEN IN UPPERCASE';
		const expectedString = 'A String Written In Uppercase';
		const capitalizedString = capitalizeString(upperCaseString);

		expect(capitalizedString).toMatch(expectedString);
	});

	it('should format the address string correctly', () => {
		const rawAddress = 'SOME INFO, 45, SOME STREET ALL UPPERCASE, A TOWN, AB1 2CD';
		const expectedAddress = 'Some Info, 45, Some Street All Uppercase, A Town, AB1 2CD';
		const formattedAddress = formatDisplayAddress(rawAddress);

		expect(formattedAddress).toMatch(expectedAddress);
	});
});
