/** @typedef {import('../../applications.types.js').OptionsItem} OptionsItem */

/**
 * Get the list of types of applicant info
 *
 * @returns {OptionsItem[]}
 */
export const getAllApplicantInfoTypes = () => {
	return [
		{
			id: 1,
			name: 'applicant-organisation-name',
			displayNameEn: 'Organisation name',
			displayNameCy: 'Organisation name'
		},
		{
			id: 2,
			name: 'applicant-name',
			displayNameEn: 'First and last name of the Applicant',
			displayNameCy: 'First and last name of the Applicant'
		},
		{
			id: 3,
			name: 'applicant-email-address',
			displayNameEn: 'Applicant or organisation email address',
			displayNameCy: 'Applicant or organisation email address'
		},
		{ id: 4, name: 'applicant-address', displayNameEn: 'Address', displayNameCy: 'Address' },
		{ id: 5, name: 'applicant-website', displayNameEn: 'Website', displayNameCy: 'Website' },
		{
			id: 6,
			name: 'applicant-telephone-number',
			displayNameEn: 'Telephone number',
			displayNameCy: 'Telephone number'
		}
	];
};
