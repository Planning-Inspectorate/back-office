import { pick } from 'lodash-es';
import { mapS51Advice } from '#utils/mapping/map-s51-advice-details.js';
import * as s51AdviceRepository from '../../repositories/s51-advice.repository.js';
import { getPageCount, getSkipValue } from '#utils/database-pagination.js';
import {
	verifyAllS51AdviceHasRequiredPropertiesForPublishing,
	verifyAllS51DocumentsAreVirusChecked,
	hasPublishedAdvice,
	hasPublishedDocument
} from './s51-advice.validators.js';
import { getCaseDetails } from '../application/application.service.js';
import {
	extractDuplicates,
	formatS51AdviceUpdateResponseBody,
	getManyS51AdviceOnCase,
	getS51AdviceDocuments
} from './s51-advice.service.js';
import * as s51AdviceDocumentRepository from '../../repositories/s51-advice-document.repository.js';
import * as caseRepository from '../../repositories/case.repository.js';
import {
	makeDocumentReference,
	obtainURLsForDocuments
} from './../application/documents/document.service.js';
import BackOfficeAppError from '../../utils/app-error.js';
import { mapDateStringToUnixTimestamp } from '../../utils/mapping/map-date-string-to-unix-timestamp.js';
import logger from '#utils/logger.js';

/** @typedef {import('@pins/applications.api').Schema.Folder} Folder */
/** @typedef {{documentName: string, folderId: number, documentType: string, documentSize: number, username: string, fromFrontOffice: boolean, documentReference: string}} Document */

/**
 * @type {import('express').RequestHandler}
 * @throws {Error}
 * @returns {Promise<void>}
 */
export const createS51Advice = async (_request, response) => {
	const { body } = _request;
	const { caseId } = body;

	const latestReferenceNumber = await s51AdviceRepository.getS51AdviceCountOnCase(caseId);
	const newReferenceNumber = latestReferenceNumber + 1;

	const payload = { ...body, referenceNumber: newReferenceNumber };
	const s51Advice = await s51AdviceRepository.create(payload);

	response.send(s51Advice);
};

/**

 * @type {import('express').RequestHandler}
 * @throws {Error}
 * @returns {Promise<void>}
 */
export const getS51Advice = async (_request, response) => {
	const { adviceId, id } = _request.params;

	//get the case Reference name - needed for the formatted advice ReferenceNumbers
	const caseDetails = await getCaseDetails(+id, {});
	// @ts-ignore
	const caseRef = caseDetails.reference;
	const s51Advice = await s51AdviceRepository.get(Number(adviceId));

	if (!s51Advice) {
		// @ts-ignore
		return response
			.status(404)
			.json({ errors: { message: `S51 advice with id: ${adviceId} not found.` } });
	}

	const attachments = await s51AdviceDocumentRepository.getForAdvice(Number(adviceId));

	/**
	 * @type {import("@pins/applications").S51AdviceDetails[] | { documentName: any; documentType: string; documentSize: string; dateAdded: number; status: string; documentGuid: string, version: number }[]}
	 */
	const attachmentsWithVersion = [];
	if (attachments?.length > 0) {
		attachments.forEach((attachment) => {
			// @ts-ignore
			const { Document } = attachment;
			const { latestDocumentVersion } = Document;
			if (!latestDocumentVersion) {
				return;
			}
			// @ts-ignore
			attachmentsWithVersion.push({
				documentName: latestDocumentVersion.fileName,
				documentType: latestDocumentVersion.mime,
				documentSize: latestDocumentVersion.size,
				dateAdded: mapDateStringToUnixTimestamp(latestDocumentVersion.dateCreated),
				status: latestDocumentVersion.publishedStatus,
				documentGuid: latestDocumentVersion.documentGuid,
				version: latestDocumentVersion.version
			});
		});
	}

	// @ts-ignore
	const mappeds51Advice = mapS51Advice(caseRef, s51Advice, attachmentsWithVersion);

	response.send(mappeds51Advice);
};

/**
 * Gets paginated array of S51 Advice records on a case
 *
 * @type {import('express').RequestHandler<{ id: number }, ?, {pageNumber?: number, pageSize?: number}, any>}
 */
export const getManyS51Advices = async ({ params, query }, response) => {
	const { id } = params;
	const { page, pageSize } = query;
	const paginatedS51Advices = await getManyS51AdviceOnCase(id, parseInt(page), parseInt(pageSize));

	response.send(paginatedS51Advices);
};

/**
 * Gets list of documents associated with an advice item
 *
 * @type {import('express').RequestHandler}
 * @throws {Error}
 * */
export const getDocuments = async ({ params }, response) => {
	const caseId = parseInt(params.id);
	const adviceId = parseInt(params.adviceId);

	const result = await getS51AdviceDocuments(caseId, adviceId);

	response.send(result);
};

/**
 * @type {import('express').RequestHandler}
 * @throws {Error}
 * @returns {Promise<void>}
 */
export const addDocuments = async ({ params, body }, response) => {
	const adviceId = Number(params.adviceId);
	const s51Advice = s51AdviceRepository.get(adviceId);

	if (!s51Advice) {
		throw new BackOfficeAppError(`S51 advice with id: ${adviceId} not found.`, 404);
	}

	const documentsToUpload = body;
	const caseId = Number(params.id);

	const existingS51ForCase = await s51AdviceRepository.getLatestRecordByCaseId(caseId);

	const theCase = await caseRepository.getById(caseId, {
		applicationDetails: true,
		gridReference: true
	});

	if (!theCase?.reference) {
		// @ts-ignore
		throw new BackOfficeAppError(`Case with id: ${caseId} not found.`, 404);
	}

	let nextReferenceIndex = existingS51ForCase?.referenceNumber
		? existingS51ForCase.referenceNumber + 1
		: 1;

	const { duplicates, remainder } = await extractDuplicates(
		adviceId,
		/** @type {Document[]} */ (documentsToUpload).map((doc) => doc.documentName)
	);

	const filteredToUpload = /** @type {Document[]} */ (documentsToUpload).filter((doc) =>
		remainder.includes(doc.documentName)
	);

	for (const doc of filteredToUpload) {
		doc.documentReference = makeDocumentReference(theCase.reference, nextReferenceIndex);
		doc.folderId = Number(doc.folderId);

		nextReferenceIndex++;
	}

	// Obtain URLs for documents from blob storage
	const { response: dbResponse, failedDocuments } = await obtainURLsForDocuments(
		filteredToUpload,
		caseId
	);

	if (dbResponse === null) {
		response.status(409).send({ failedDocuments, duplicates });
		return;
	}

	const { blobStorageHost, privateBlobContainer, documents } = dbResponse;

	const s51Documents = documents.map((doc) => ({
		adviceId,
		documentGuid: doc.GUID
	}));

	if (s51Documents.length > 0) {
		await s51AdviceDocumentRepository.create(s51Documents);
	}

	const documentsWithUrls = documents.map((doc) =>
		pick(doc, ['documentName', 'documentReference', 'blobStoreUrl', 'GUID'])
	);

	response.status([...failedDocuments, ...duplicates].length > 0 ? 206 : 200).send({
		blobStorageHost,
		privateBlobContainer,
		documents: documentsWithUrls,
		failedDocuments,
		duplicates
	});
};

export const getRedactionStatus = (/** @type {boolean} */ redactedStatus) => {
	return redactedStatus ? 'redacted' : 'not_redacted';
};

/**
 * Updates properties of an S51 advice item
 *
 * @type {import('express').RequestHandler<{adviceId: number}, any, any, any>}
 */
export const updateS51Advice = async ({ body, params }, response) => {
	const adviceId = params.adviceId;
	const payload = body[''];

	if (payload.publishedStatus === 'ready_to_publish') {
		try {
			await verifyAllS51AdviceHasRequiredPropertiesForPublishing([adviceId]);
		} catch (err) {
			logger.info(
				`received error from verifyAllS51AdviceHasRequiredPropertiesForPublishing: ${err}`
			);
			throw new BackOfficeAppError(
				`All mandatory fields must be completed.\nReturn to the S51 advice properties screen to make changes.`,
				400
			);
		}

		try {
			await verifyAllS51DocumentsAreVirusChecked(adviceId);
		} catch (err) {
			logger.info(`received error from verifyAllS51DocumentsAreVirusChecked: ${err}`);
			throw new BackOfficeAppError(
				`There are attachments which have failed the virus check.\nReturn to the S51 advice properties screen to delete files.`,
				400
			);
		}
	}

	const publishedAdvices = await hasPublishedAdvice([adviceId]);
	if (publishedAdvices) {
		logger.info(`Can not change status, advice is already published for adviceId: ${adviceId}`);
		throw new BackOfficeAppError(
			`You must first unpublish S51 advice before changing the status.`,
			400
		);
	}

	const publishedDocuments = await hasPublishedDocument([adviceId]);
	if (publishedDocuments) {
		logger.info(`Can not change status, advice has published documents as attachment: ${adviceId}`);
		throw new BackOfficeAppError(
			`You must first unpublish documents before changing the status.`,
			400
		);
	}

	const updateResponseInTable = await s51AdviceRepository.update(adviceId, payload);

	response.send(updateResponseInTable);
};

/**
 * Updates the status and / or redaction status of an array of S51 Advice on a case.
 * There can be a status parameter, or a redacted parameter, or both
 *
 * @type {import('express').RequestHandler<{id: number}, any, any, any>}
 */
export const updateManyS51Advices = async ({ body }, response) => {
	const { status: publishedStatus, redacted: isRedacted, items } = body[''];
	const formattedResponseList = [];
	const adviceIds = items.map((/** @type {{ id: number }} */ advice) => advice.id);

	let redactedStatus;

	// special case - this fn can be called without setting redaction status - in which case a redaction status should not be passed in to the update fn
	// and the redaction status of each advice should remain unchanged.
	if (typeof isRedacted !== 'undefined') {
		redactedStatus = getRedactionStatus(isRedacted);
	}

	// special case - for Ready to Publish, need to check that required metadata is set on all the advice - else error
	if (publishedStatus === 'ready_to_publish') {
		try {
			await verifyAllS51AdviceHasRequiredPropertiesForPublishing(adviceIds);
		} catch (error) {
			logger.info(`received error from verifyAllS51DocumentsAreVirusChecked: ${error}`);
			throw new BackOfficeAppError(
				// @ts-ignore
				'All mandatory fields must be completed. Return to the S51 advice properties screen to make changes.',
				400
			);
		}

		try {
			/**
			 * @type {any[]}
			 */
			const virusCheckPromise = adviceIds.map(verifyAllS51DocumentsAreVirusChecked);

			await Promise.all(virusCheckPromise);
		} catch (error) {
			logger.info(`received error from verifyAllS51DocumentsAreVirusChecked: ${error}`);
			throw new BackOfficeAppError(
				// @ts-ignore
				'There are attachments which have failed the virus check. Return to the S51 advice properties screen to delete files.',
				400
			);
		}
	}

	const publishedAdvices = await hasPublishedAdvice(adviceIds);
	if (publishedAdvices) {
		logger.info('Can not change status, advice is already published');
		throw new BackOfficeAppError(
			'You must first unpublish S51 advice before changing the status.',
			400
		);
	}

	const publishedDocuments = await hasPublishedDocument(adviceIds);
	if (publishedDocuments) {
		logger.info('Can not change status, advices has published documents as attachments');
		throw new BackOfficeAppError(
			'You must first unpublish documents before changing the status.',
			400
		);
	}

	for (const advice of items ?? []) {
		logger.info(
			`Updating S51 Advice with id: ${advice.id} to published status: ${publishedStatus} and redacted status: ${redactedStatus}`
		);

		/**
		 * @typedef {object} Updates
		 * @property {string} [publishedStatus]
		 * @property {string} [publishedStatusPrev]
		 * @property {string} [redactedStatus]
		 */

		/** @type {Updates} */
		const adviceUpdates = {
			publishedStatus,
			redactedStatus
		};

		if (typeof publishedStatus === 'undefined') {
			delete adviceUpdates.publishedStatus;
		} else {
			// when setting publishedStatus, save previous publishedStatus
			// do we have a published status, and is that status different
			const currentAdvice = await s51AdviceRepository.get(advice.id);
			if (typeof currentAdvice !== 'undefined' && currentAdvice !== null) {
				if (
					typeof currentAdvice.publishedStatus !== 'undefined' &&
					currentAdvice.publishedStatus !== publishedStatus
				) {
					adviceUpdates.publishedStatusPrev = currentAdvice.publishedStatus;
				}
			}
		}

		const updateResponseInTable = await s51AdviceRepository.update(advice.id, adviceUpdates);
		const formattedResponse = formatS51AdviceUpdateResponseBody(
			updateResponseInTable.id.toString() ?? '',
			updateResponseInTable.publishedStatus ?? '',
			updateResponseInTable.redactedStatus ?? ''
		);

		formattedResponseList.push(formattedResponse);
	}

	response.send(formattedResponseList);
};

/**
 * Gets paginated array of S51 advices
 *
 * @type {import('express').RequestHandler<{ folderId: number, id: number }, ?, {pageNumber?: number, pageSize?: number}, any>}
 */
export const getReadyToPublishAdvices = async ({ params: { id }, body }, response) => {
	const { pageNumber = 1, pageSize = 125 } = body;

	const skipValue = getSkipValue(pageNumber, pageSize);
	const caseId = Number(id);

	const paginatedAdviceToPublish = await s51AdviceRepository.getReadyToPublishAdvices({
		skipValue,
		pageSize,
		caseId
	});

	const adviceCount = await s51AdviceRepository.getS51AdviceCountInByPublishStatus(caseId);

	// @ts-ignore
	const items = paginatedAdviceToPublish.map(advice => mapS51Advice(caseId, advice, advice.S51AdviceDocument));

	response.send({
		page: pageNumber,
		pageDefaultSize: pageSize,
		pageCount: getPageCount(adviceCount, pageSize),
		itemCount: adviceCount,
		items
	});
};

/**
 * 
 * @param {*} body 
 * @param {*} response 
 * @returns 
 */
export const removePublishItemFromQueue = async ({ body }, response) => {
	const adviceId = Number(body.adviceId);

	const s51Advice = await s51AdviceRepository.get(adviceId);
	if (!s51Advice) {
		// @ts-ignore
		return response
			.status(404)
			.json({ errors: { message: `S51 advice with id: ${adviceId} not found.` } });
	}

	const updatedS51Advice = await s51AdviceRepository.update(adviceId, { publishedStatus: s51Advice.publishedStatusPrev });

	response.send(updatedS51Advice);
}
