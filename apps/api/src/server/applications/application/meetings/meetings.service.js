import * as meetingRepository from '#repositories/meeting.repository.js';

/**
 *
 * @param caseId
 * @returns {Promise<import('@pins/applications.api').Schema.Meeting[]>}
 */
export const getCaseMeetings = async (caseId) => {
	return meetingRepository.getMeetingsByCase(caseId);
};

/**
 *
 * @param {number} meetingId
 * @param {number} caseId
 * @returns {Promise<import('@pins/applications.api').Schema.Meeting | null>}
 */
export const getCaseMeeting = async (meetingId, caseId) => {
	return meetingRepository.getMeetingById(Number(meetingId), caseId);
};

/**
 *
 * @param {import('@pins/applications.api').Schema.Meeting} meeting
 * @returns {Promise<import('@pins/applications.api').Schema.Meeting>}
 */
export const createCaseMeeting = async (meeting) => {
	return meetingRepository.createMeeting(meeting);
};

/**
 *
 * @param {import('@pins/applications.api').Schema.Meeting} meeting
 * @returns {Promise<import('@pins/applications.api').Schema.Meeting>}
 */
export const patchCaseMeeting = async (meeting) => {
	return meetingRepository.updateMeetingById(meeting);
};

/**
 *
 * @param {number} meetingId
 * @returns {Promise<import('@pins/applications.api').Schema.Meeting>}
 */
export const deleteCaseMeeting = async (meetingId) => {
	return meetingRepository.deleteMeetingById(Number(meetingId));
};
