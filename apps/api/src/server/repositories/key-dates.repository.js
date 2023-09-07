import { databaseConnector } from '../utils/database-connector.js';

/**
 *
 * @param {number} caseId
 * @param {any} keyDates
 *
 * @returns {Promise<import('@pins/applications.api').Schema.ApplicationDetails>}
 */
export const update = async (caseId, keyDates) => {
	// We need to modify the case here because we need to increment the modifiedAt date
	const updatedCase = await databaseConnector.case.update({
		where: { id: caseId },
		data: {
			modifiedAt: new Date(),
			ApplicationDetails: keyDates
		},
		select: {
			ApplicationDetails: true
		}
	});

	// @ts-ignore
	return updatedCase.ApplicationDetails;
};

/**
 *
 * @param {number} caseId
 * @returns {Promise<import('@pins/applications.api').Schema.ApplicationDetails | null>}
 */
export const get = (caseId) => {
	return databaseConnector.applicationDetails.findUnique({
		where: { caseId }
	});
};
