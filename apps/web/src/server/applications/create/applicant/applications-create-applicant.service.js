import { getApplicationDraft } from '../applications-create.service.js';
import { getSessionCaseHasNeverBeenResumed } from '../case/applications-create-case-session.service.js';
import { getSessionApplicantInfoTypes } from './applications-create-applicant-session.service.js';

/** @typedef {import('../../applications.types.js').OptionsItem} OptionsItem */
/** @typedef {import('../../applications.types.js').Applicant} Applicant */
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
	const canShowInfoTypesPage = getSessionCaseHasNeverBeenResumed(session);
	const allApplicantPaths = [
		canShowInfoTypesPage ? 'applicant-information-types' : 'team-email',
		...getAllApplicantInfoTypes().map((infoType) => infoType.name),
		'key-dates'
	];
	const allowedApplicantPaths = canShowInfoTypesPage
		? getSessionApplicantInfoTypes(session)
		: allApplicantPaths;
	const currentPathIndex = allApplicantPaths.indexOf(path.replace(/\//g, ''));

	let destinationPath = '';
	let destinationPathIndex = currentPathIndex;

	while (
		!allowedApplicantPaths.includes(destinationPath) &&
		Math.abs(destinationPathIndex) < allApplicantPaths.length
	) {
		destinationPathIndex += goToNextPage ? 1 : -1;
		destinationPath = allApplicantPaths[destinationPathIndex] ?? destinationPath;
	}

	return destinationPath || '';
}

/**
 * Returns the nth applicant of a draft application
 *
 * @param {number} applicationId
 * @param {number} applicantNumber
 * @returns {Promise<Applicant|null>}
 */
export async function getNthApplicant(applicationId, applicantNumber) {
	const { applicants } = await getApplicationDraft(applicationId);

	return applicants && applicants.length > 0 ? applicants[applicantNumber] : null;
}
