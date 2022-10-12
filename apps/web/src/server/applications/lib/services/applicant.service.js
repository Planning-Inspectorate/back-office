import { getCase } from './case.service.js';

/** @typedef {import('../../applications.types.js').Applicant} Applicant */

/**
 * Returns the applicant matching id of a draft application
 *
 * @param {number} applicationId
 * @param {number} applicantId
 * @param { string[] | null } query
 * @returns {Promise<Applicant|null>}
 */
export async function getApplicantById(applicationId, applicantId, query = null) {
	const { applicants } = await getCase(applicationId, query);

	let applicant;

	if (applicants && applicants.length > 0) {
		applicant = applicants.find((apps) => apps.id === applicantId);
	}
	return applicant || null;
}
