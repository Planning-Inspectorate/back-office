import { getEventClient, EventType } from '@pins/event-client';
import { getDocumentProperties, getDocumentFolders } from './back-office-api-client';
import config from './config';
const { serviceBus } = config;

/**
 *
 * @param {import('@azure/functions').Context} context
 * @param {string} guid
 * */
export const handleNotInfected = async (context, guid) => {
	const document = await getDocumentProperties(guid);
	if (!document) {
		throw new Error(`No document found with guid ${guid}`);
	}

	if (!document.fromFrontOffice) {
		return;
	}

	const folders = await getDocumentFolders(guid);
	if (!folders || folders.length < 2) {
		throw new Error(
			`Returned ${folders} when fetching folders for document from front office: "${guid}"`
		);
	}

	const event = {
		status: 'SUCCESS',
		deadline: folders[1].displayNameEn,
		submissionType: folders[0].displayNameEn,
		blobGuid: guid,
		documentName: document.documentName
	};

	const eventClient = getEventClient(true, context.log, serviceBus.host);
	await eventClient.sendEvents(serviceBus.topic, [event], EventType.Success);
};

/**
 *
 * @param {import('@azure/functions').Context} context
 * @param {string} guid
 * */
export const handleInfected = async (context, guid) => {
	const document = await getDocumentProperties(guid);
	if (!document) {
		throw new Error(`No document found with guid ${guid}`);
	}

	if (!document.fromFrontOffice) {
		return;
	}

	const folders = await getDocumentFolders(guid);
	if (!folders || folders.length < 2) {
		throw new Error(
			`Returned ${folders} when fetching folders for document from front office: "${guid}"`
		);
	}

	const event = {
		status: 'VIRUS_DETECTED',
		deadline: folders[1].displayNameEn,
		submissionType: folders[0].displayNameEn,
		blobGuid: guid,
		documentName: document.documentName
	};

	const eventClient = getEventClient(true, context.log, serviceBus.host);
	await eventClient.sendEvents(serviceBus.topic, [event], EventType.Failure);
};
