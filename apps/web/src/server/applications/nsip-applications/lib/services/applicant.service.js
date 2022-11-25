import { getCase } from './case.service.js';

/** @typedef {import('../../applications.types.js').Applicant} Applicant */

/**
 * Returns the applicant matching id of a draft case
 *
 * @param {number} caseId
 * @param {number} applicantId
 * @param { string[] | null } query
 * @returns {Promise<Applicant|null>}
 */
export async function getApplicantById(caseId, applicantId, query = null) {
	const { applicants } = await getCase(caseId, query);

	let applicant;

	if (applicants && applicants.length > 0) {
		applicant = applicants.find((apps) => apps.id === applicantId);
	}
	return applicant || null;
}
