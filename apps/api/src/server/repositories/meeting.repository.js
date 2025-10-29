import { databaseConnector } from '#utils/database-connector.js';

/**
 * @param {number} caseId
 * @returns {Promise<import('@pins/applications.api').Schema.Meeting[]>}
 */
export const getMeetingsByCase = (caseId) => {
	return databaseConnector.meeting.findMany({
		where: { caseId },
		orderBy: { createdAt: 'asc' }
	});
};

/**
 * @param {number} id
 * @returns {Promise<import('@pins/applications.api').Schema.Meeting | null>}
 */
export const getMeetingById = (id) => {
	return databaseConnector.meeting.findUnique({
		where: { id }
	});
};

/**
 * @param {number} id
 * @param {number} caseId
 * @param {string} agenda
 * @param {string} pinsRole
 * @param {DateTime} meetingDate
 * @param {string} meetingType
 * @returns {Promise<import('@pins/applications.api').Schema.Meeting>}
 */
export const updateMeetingById = (id, caseId, agenda, pinsRole, meetingDate, meetingType) => {
	return databaseConnector.meeting.upsert({
		where: { id },
		create: { caseId, agenda, pinsRole, meetingDate, meetingType },
		update: { agenda, pinsRole, meetingDate, meetingType }
	});
};

/**
 * @param {number} id
 * @returns {Promise<import('@pins/applications.api').Schema.Meeting>}
 */
export const deleteMeetingById = (id) => {
	return databaseConnector.meeting.delete({
		where: { id }
	});
};
