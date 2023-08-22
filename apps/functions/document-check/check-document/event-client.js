import { getEventClient, EventType } from '@pins/event-client';
import { getDocumentProperties, getDocumentFolders } from './back-office-api-client.js';
import config from './config.js';
const { serviceBus } = config;

/**
 * @typedef {import('../../../api/src/message-schemas/events/nsip-exam-timetable-submission.schema.d.ts').NSIPExamTimetableSubmissionStatus} NSIPExamTimetableSubmissionStatus
 * */

/**
 *
 * @param {import('@azure/functions').Context} context
 * @param {string} guid
 * @param {NSIPExamTimetableSubmissionStatus} eventStatus
 * @param {EventType} eventType
 * */
const handlePublishResult = async (context, guid, eventStatus, eventType) => {
	const document = await getDocumentProperties(guid, context.log);
	if (!document) {
		throw new Error(`No document found with guid ${guid}`);
	}

	if (!document.fromFrontOffice) {
		return;
	}

	const folders = await getDocumentFolders(guid, context.log);
	if (!folders || folders.length < 2) {
		throw new Error(
			`Returned ${folders} when fetching folders for document from front office: "${guid}"`
		);
	}

	const event = {
		status: eventStatus,
		deadline: folders[1].displayNameEn,
		submissionType: folders[0].displayNameEn,
		blobGuid: guid,
		documentName: document.documentName
	};

	const eventClient = getEventClient(true, context.log, serviceBus.host);
	await eventClient.sendEvents(serviceBus.topic, [event], eventType);
};

/**
 *
 * @param {import('@azure/functions').Context} context
 * @param {string} guid
 * */
export const handleNotInfected = async (context, guid) =>
	handlePublishResult(context, guid, 'SUCCESS', EventType.Create);

/**
 *
 * @param {import('@azure/functions').Context} context
 * @param {string} guid
 * */
export const handleInfected = async (context, guid) =>
	handlePublishResult(context, guid, 'VIRUS_DETECTED', EventType.Create);
