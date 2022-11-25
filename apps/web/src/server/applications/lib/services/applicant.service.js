/** @typedef {import('../../applications.types.js').Applicant} Applicant */
/** @typedef {import('../../applications.types.js').Case} Case */

/**
 * Returns the applicant matching id of a draft case
 *
 * @param {Case} currentCase
 * @param {number} applicantId
 * @returns {Promise<Applicant|undefined>}
 */
export async function getApplicantById(currentCase, applicantId) {
	const { applicants } = currentCase;
	/** @type {Applicant[] } */
	const allApplicants = applicants ?? [];

	return allApplicants.find((applicant) => applicant.id === applicantId);
}
