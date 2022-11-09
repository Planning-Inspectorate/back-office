/**
 * Register the userTypeMap filter for the domainType
 *
 * @param {string} key
 */

export const userTypeMap = (key) => {
	switch (key) {
		case 'case-admin-officer':
			return 'Case admin officer';
		case 'case-officer':
			return 'Case officer';
		case 'inspector':
			return 'Inspector';
		case 'validation-officer':
			return 'Validation officer';
		default:
			return '';
	}
};
