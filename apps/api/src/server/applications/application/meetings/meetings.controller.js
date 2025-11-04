import BackOfficeAppError from '#utils/app-error.js';
import {
	createCaseMeeting,
	deleteCaseMeeting,
	getCaseMeeting,
	getCaseMeetings,
	patchCaseMeeting
} from './meetings.service.js';

/**
 * Gets all meetings for the case specified
 *
 * @type {import('express').RequestHandler<{id: number}>}
 */
export const getManyMeetings = async ({ params }, res) => {
	const { id: caseId } = params;
	const meetingsForCase = await getCaseMeetings(caseId);

	if (!meetingsForCase || meetingsForCase.length === 0) {
		throw new BackOfficeAppError(`No meetings found for application with id: ${caseId}`, 404);
	}

	res.send(meetingsForCase);
};

/**
 * Gets a specific meeting for the case specified
 *
 * @type {import('express').RequestHandler<{meetingId: number}>}
 */
export const getMeeting = async ({ params }, res) => {
	const { meetingId: meetingId, id: caseId } = params;

	const meeting = await getCaseMeeting(Number(meetingId), caseId);

	if (!meeting) {
		throw new BackOfficeAppError(`Meeting with id: ${meetingId} not found`, 404);
	}

	res.send(meeting);
};

/**
 * Creates a meeting for the case specified
 *
 * @type {import('express').RequestHandler<{id: number}, ?, import('@pins/applications.api').Schema.Meeting>}
 */
export const createMeeting = async ({ params, body }, res) => {
	const mappedMeeting = {
		caseId: params.id,
		...body
	};

	const meeting = await createCaseMeeting(mappedMeeting);

	if (!meeting) {
		throw new BackOfficeAppError(
			`Meeting could not be created for application with id: ${params.id}`,
			400
		);
	}

	return res.status(201).send(meeting);
};

/**
 * Updates a specified meeting
 *
 * @type {import('express').RequestHandler<{id: number, meetingId: number}, ?, import('@pins/applications.api').Schema.Meeting>}
 */
export const patchMeeting = async ({ params, body }, res) => {
	const mappedMeeting = {
		id: Number(params.meetingId),
		caseId: params.id,
		...body
	};

	const meeting = await patchCaseMeeting(mappedMeeting);

	if (!meeting) {
		throw new BackOfficeAppError(
			`Meeting could not be updated for application with id: ${params.id}`,
			400
		);
	}

	return res.send(meeting);
};

/**
 * Deletes a specified meeting
 *
 * @type {import('express').RequestHandler<{id: number, meetingId: number}>}
 */
export const deleteMeeting = async ({ params }, res) => {
	const { meetingId: meetingId, id: caseId } = params;

	const meetingExists = await getCaseMeeting(Number(meetingId), caseId);
	if (!meetingExists) {
		throw new BackOfficeAppError(`Meeting with id: ${meetingId} not found`, 404);
	}

	console.log(meetingExists);
	console.log('AAASJHFASUIJKFHJAISUJKFHUIASGHAS');

	const meeting = deleteCaseMeeting(meetingId);
	if (!meeting) {
		throw new BackOfficeAppError(`Meeting with id: ${meetingId} could not be deleted`, 400);
	}

	res.status(204).send();
};
