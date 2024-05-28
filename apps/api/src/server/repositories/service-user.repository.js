import { databaseConnector } from '#utils/database-connector.js';

/**
 * Find a Service User by their email address
 *
 * In practice, service user emails are unique - but they're also nullable.
 *
 * @param {string} email
 * @returns {Promise<import('@prisma/client').ServiceUser|null>}
 */
export function findByEmail(email) {
	return databaseConnector.serviceUser.findFirst({
		where: {
			email
		}
	});
}

/**
 *
 * @param {number} caseId
 */
export async function getByCaseId(caseId) {
	const caseData = await databaseConnector.case.findUnique({
		where: {
			id: caseId
		},
		include: {
			applicant: true,
			Representation: {
				include: {
					represented: true,
					representative: true
				}
			}
		}
	});

	if (!caseData) {
		return [];
	}

	const serviceUsers = new Set();

	if (caseData.applicant) {
		serviceUsers.add(caseData.applicant);
	}

	caseData.Representation.forEach((representation) => {
		if (representation.represented) {
			serviceUsers.add(representation.represented);
		}
		if (representation.representative) {
			serviceUsers.add(representation.representative);
		}
	});

	return Array.from(serviceUsers);
}
