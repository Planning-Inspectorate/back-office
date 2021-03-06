import { getSessionApplicantInfoTypes } from './applications-create-applicant-session.service.js';

/** @typedef {import('../../applications.types.js').OptionsItem} OptionsItem */
/** @typedef {import('./applications-create-applicant-session.service.js').SessionWithApplicationsCreateApplicantInfoTypes} SessionWithApplicationsCreateApplicantInfoTypes */

/**
 * Get the list of types of applicant info
 *
 * @returns {OptionsItem[]}
 */
export const getAllApplicantInfoTypes = () => {
	return [
		{
			name: 'applicant-organisation-name',
			displayNameEn: 'Organisation name',
			displayNameCy: 'Organisation name'
		},
		{
			name: 'applicant-full-name',
			displayNameEn: 'First and last name of the Applicant',
			displayNameCy: 'First and last name of the Applicant'
		},
		{ name: 'applicant-address', displayNameEn: 'Address', displayNameCy: 'Address' },
		{ name: 'applicant-website', displayNameEn: 'Website', displayNameCy: 'Website' },
		{
			name: 'applicant-email',
			displayNameEn: 'Email address',
			displayNameCy: 'Email address'
		},
		{
			name: 'applicant-telephone-number',
			displayNameEn: 'Telephone number',
			displayNameCy: 'Telephone number'
		}
	];
};

/**
 * Returns the prev/next allowed step in the Applicant Information form according to the data
 * saved in the session in the information types page.
 *
 * @param {{session: SessionWithApplicationsCreateApplicantInfoTypes, path: string, goToNextPage: boolean}} params
 * @returns {string}
 */
export function getAllowedDestinationPath({ session, path, goToNextPage }) {
	// TODO: this will be false if the API returns already existing data for the applicant
	const noInformationTypesFromAPI = true;
	const canShowInfoTypesPage = session !== null && noInformationTypesFromAPI;
	const allApplicantPaths = [
		canShowInfoTypesPage ? 'applicant-information-types' : 'team-email',
		...getAllApplicantInfoTypes().map((infoType) => infoType.name),
		'key-dates'
	];
	const allowedApplicantPaths = getSessionApplicantInfoTypes(session);
	const currentPathIndex = allApplicantPaths.indexOf(path.replace(/\//g, ''));

	let destinationPath = '';
	let destinationPathIndex = currentPathIndex;

	while (
		!allowedApplicantPaths.includes(destinationPath) &&
		Math.abs(destinationPathIndex) < allApplicantPaths.length - 1
	) {
		destinationPathIndex += goToNextPage ? 1 : -1;
		destinationPath = allApplicantPaths[destinationPathIndex];
	}

	return destinationPath || '';
}
