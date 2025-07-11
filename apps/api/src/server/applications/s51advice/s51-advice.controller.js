import { pick } from 'lodash-es';
import { EventType } from '@pins/event-client';
import { mapS51Advice } from '#utils/mapping/map-s51-advice-details.js';
import * as s51AdviceRepository from '#repositories/s51-advice.repository.js';
import { getPageCount, getSkipValue } from '#utils/database-pagination.js';
import {
	verifyAllS51AdviceHasRequiredPropertiesForPublishing,
	verifyAllS51DocumentsAreVirusChecked,
	hasPublishedAdvice,
	hasPublishedDocument
} from './s51-advice.validators.js';
import { getCaseDetails } from '../application/application.service.js';
import {
	checkCanPublish,
	extractDuplicatesAndDeleted,
	formatS51AdviceUpdateResponseBody,
	getManyS51AdviceOnCase,
	getS51AdviceDocuments,
	performStatusChangeChecks,
	publishS51Items,
	unpublishS51
} from './s51-advice.service.js';
import { broadcastNsipS51AdviceEvent } from '#infrastructure/event-broadcasters.js';
import * as s51AdviceDocumentRepository from '#repositories/s51-advice-document.repository.js';
import * as caseRepository from '#repositories/case.repository.js';
import {
	makeDocumentReference,
	createDocuments,
	deleteDocument,
	getIndexFromReference
} from './../application/documents/document.service.js';
import BackOfficeAppError from '#utils/app-error.js';
import { mapDateStringToUnixTimestamp } from '#utils/mapping/map-date-string-to-unix-timestamp.js';
import logger from '#utils/logger.js';
import isCaseWelsh from '#utils/is-case-welsh.js';
import { getLatestDocReferenceByCaseIdExcludingMigrated } from '#repositories/document.repository.js';

/**
 * @typedef {import('@pins/applications.api').Schema.Folder} Folder
 * @typedef {import('@pins/applications.api').Api.DocumentToSaveExtended} DocumentToSaveExtended
 * @typedef {import('@pins/applications.api').Api.S51AdviceDocumentDetails} S51AdviceDocumentDetails
 */

/**
 * @type {import('express').RequestHandler}
 * @throws {Error}
 * @returns {Promise<void>}
 */
export const createS51Advice = async (_request, response) => {
	const { body } = _request;
	const { caseId } = body;

	const latestReferenceNumber = await s51AdviceRepository.getS51AdviceCountOnCase(caseId, true);
	const newReferenceNumber = latestReferenceNumber + 1;

	const payload = { ...body, referenceNumber: newReferenceNumber };
	const s51Advice = await s51AdviceRepository.create(payload);

	// broadcast s51 advice event
	await broadcastNsipS51AdviceEvent(s51Advice, EventType.Create);

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
		throw new BackOfficeAppError(`S51 advice with id: ${adviceId} not found.`, 404);
	}

	const attachments = await s51AdviceDocumentRepository.getForAdvice(Number(adviceId));

	/**
	 * @type {import("@pins/applications").S51AdviceDetails[] | S51AdviceDocumentDetails[]}
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
 * @type {import('express').RequestHandler<{ id: number }, ?, {page?: number, pageSize?: number}, any>}
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
 * Adds one or more S51 Advice documents to an S51 Advice
 *
 * @type {import('express').RequestHandler}
 * @throws {Error}
 * @returns {Promise<void>}
 */
export const addDocuments = async ({ params, body }, response) => {
	const adviceId = Number(params.adviceId);
	const s51Advice = await s51AdviceRepository.get(adviceId);

	if (!s51Advice) {
		throw new BackOfficeAppError(`S51 advice with id: ${adviceId} not found.`, 404);
	}

	const documentsToUpload = body;
	const caseId = Number(params.id);

	const theCase = await caseRepository.getById(caseId, {
		applicationDetails: true,
		gridReference: true
	});

	if (!theCase?.reference) {
		throw new BackOfficeAppError(`Case with id: ${caseId} not found.`, 404);
	}

	// find the latest document reference for this case, and then add 1 for the next free one
	const latestDocumentReference = await getLatestDocReferenceByCaseIdExcludingMigrated({
		caseId
	});

	const lastReferenceIndex = latestDocumentReference
		? getIndexFromReference(latestDocumentReference)
		: 1;
	let nextDocumentReferenceIndex = lastReferenceIndex ? lastReferenceIndex + 1 : 1;

	const { duplicates, deleted, remainder } = await extractDuplicatesAndDeleted(
		adviceId,
		/** @type {DocumentToSaveExtended[]} */ (documentsToUpload).map((doc) => doc.documentName)
	);

	const filteredToUpload = /** @type {DocumentToSaveExtended[]} */ (documentsToUpload).filter(
		(doc) => remainder.includes(doc.documentName)
	);

	for (const doc of filteredToUpload) {
		doc.documentReference = makeDocumentReference(theCase.reference, nextDocumentReferenceIndex);
		doc.folderId = Number(doc.folderId);

		nextDocumentReferenceIndex++;
	}

	// create document records
	const { response: dbResponse, failedDocuments } = await createDocuments(
		filteredToUpload,
		caseId,
		true
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

	// broadcast s51 advice event
	// need to pull the latest docs on the advice to add to payload
	const adviceDocs = await s51AdviceDocumentRepository.getForAdvice(s51Advice.id);
	s51Advice.S51AdviceDocument = adviceDocs ?? [];
	await broadcastNsipS51AdviceEvent(s51Advice, EventType.Update);

	response.status([...failedDocuments, ...duplicates, ...deleted].length > 0 ? 206 : 200).send({
		blobStorageHost,
		privateBlobContainer,
		documents: documentsWithUrls,
		failedDocuments,
		duplicates,
		deleted
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
	const caseIsWelsh = await isCaseWelsh(params.id);
	const payload = body[''];

	if (payload.publishedStatus === 'ready_to_publish') {
		await checkCanPublish(adviceId, caseIsWelsh);
	}

	if (payload.publishedStatus && payload.publishedStatus !== 'unpublished') {
		await performStatusChangeChecks(adviceId);

		const advice = await s51AdviceRepository.get(adviceId);
		if (!advice) {
			throw new BackOfficeAppError(`no S51 advice found with id ${adviceId}`, 404);
		}

		payload.publishedStatusPrev = advice.publishedStatus;
	}

	const updatedS51Advice = await s51AdviceRepository.update(adviceId, payload);

	// broadcast s51 advice event
	await broadcastNsipS51AdviceEvent(updatedS51Advice, EventType.Update);

	response.send(updatedS51Advice);
};

/**
 * Updates the status and / or redaction status of an array of S51 Advice on a case.
 * There can be a status parameter, or a redacted parameter, or both
 *
 * @type {import('express').RequestHandler<{id: number}, any, any, any>}
 */
export const updateManyS51Advices = async ({ body, params }, response) => {
	const { status: publishedStatus, redacted: isRedacted, items } = body[''];
	const formattedResponseList = [];
	const adviceIds = items.map((/** @type {{ id: number }} */ advice) => advice.id);
	const caseIsWelsh = await isCaseWelsh(params.id);

	let redactedStatus;

	// special case - this fn can be called without setting redaction status - in which case a redaction status should not be passed in to the update fn
	// and the redaction status of each advice should remain unchanged.
	if (typeof isRedacted !== 'undefined') {
		redactedStatus = getRedactionStatus(isRedacted);
	}

	// special case - for Ready to Publish, need to check that required metadata is set on all the advice - else error
	if (publishedStatus === 'ready_to_publish') {
		const err = await verifyAllS51AdviceHasRequiredPropertiesForPublishing(adviceIds, caseIsWelsh);
		if (err) {
			logger.info(`received error from verifyAllS51DocumentsAreVirusChecked: ${err}`);
			throw new BackOfficeAppError('Enter missing information about the S51 advice', 400);
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

		const updatedS51Advice = await s51AdviceRepository.update(advice.id, adviceUpdates);
		const formattedResponse = formatS51AdviceUpdateResponseBody(
			updatedS51Advice.id.toString() ?? '',
			updatedS51Advice.publishedStatus ?? '',
			updatedS51Advice.redactedStatus ?? ''
		);

		formattedResponseList.push(formattedResponse);

		// broadcast s51 advice event
		await broadcastNsipS51AdviceEvent(updatedS51Advice, EventType.Update);
	}

	response.send(formattedResponseList);
};

/**
 * Gets paginated array of 'Ready to Publish' S51 advices
 *
 * @type {import('express').RequestHandler<{ folderId: number, id: number }, ?, {pageNumber?: number, pageSize?: number}, any>}
 */
export const getReadyToPublishAdvices = async ({ params: { id }, body }, response) => {
	const { pageNumber = 1, pageSize = 125 } = body;

	const skipValue = getSkipValue(pageNumber, pageSize);
	const caseId = Number(id);

	//get the case Reference name - needed for the formatted advice ReferenceNumbers
	const caseDetails = await getCaseDetails(+id, {});
	// @ts-ignore
	const caseRef = caseDetails.reference;

	const paginatedAdviceToPublish = await s51AdviceRepository.getReadyToPublishAdvices({
		skipValue,
		pageSize,
		caseId
	});

	const adviceCount = await s51AdviceRepository.getS51AdviceCountInByPublishStatus(caseId);

	// @ts-ignore
	const items = paginatedAdviceToPublish.map((advice) =>
		mapS51Advice(caseRef, advice, advice.S51AdviceDocument, true)
	);

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
		throw new BackOfficeAppError(`S51 advice with id: ${adviceId} not found.`, 404);
	}

	const updatedS51Advice = await s51AdviceRepository.update(adviceId, {
		publishedStatus: s51Advice.publishedStatusPrev
	});

	// broadcast s51 advice event
	await broadcastNsipS51AdviceEvent(updatedS51Advice, EventType.Update);

	response.send(updatedS51Advice);
};

/**
 * Checks whether passed s51 title is unique to this case. Test is case-insensitive, and search string is trimmed.
 *
 * @type {import('express').RequestHandler<{id: number, title: string}, any, any, any>}
 */
export const verifyS51TitleIsUnique = async ({ params }, response) => {
	const { id, title } = params;
	const existingAdvice = await s51AdviceRepository.getS51AdviceManyByTitle(id, title.trim());

	if (existingAdvice && existingAdvice.length > 0) {
		throw new BackOfficeAppError(`Title already exists`, 400);
	}

	response.send({ title: title.trim() });
};

/**
 * Publishes an array of S51 Advice selected from the Ready to Publish queue, and any attached documents
 * TODO: Ideally, we update the table entry after successfully sending to service bus
 * CORRECT ORDER
 * pull object from db
 * add properties to pulled item: published, datePublished, publishedStatusPrev
 * filter out training S51s
 * build NsipS51AdvicePayload for eventbus
 * once confirmed, update db entry with new published object
 * END
 * @type {import('express').RequestHandler<{ id: string }, ?, {publishAll?: boolean, ids: string[]}>}
 * */
export const publishQueueItems = async ({ body }, response) => {
	if (!body.ids.length) {
		throw new BackOfficeAppError('`ids` must be specified in request body');
	}

	const { fulfilled, errors } = await publishS51Items(body.ids.map(Number));

	if (errors.length === body.ids.length) {
		throw new BackOfficeAppError(`publishQueueItems failed with errors:\n${errors.join('\n')}`);
	}

	// ensure any docs are populated in in the payload
	for (const f of fulfilled) {
		const docs = await s51AdviceDocumentRepository.getForAdvice(f.id);
		f.S51AdviceDocument = docs;
	}

	// broadcast s51 advice event
	await broadcastNsipS51AdviceEvent(fulfilled, EventType.Publish);

	if (errors.length > 0) {
		response.status(206).send({
			results: fulfilled,
			errors
		});

		return;
	}

	response.status(200).send({ results: fulfilled });
};

/**
 * Soft-deletes an S51 Advice
 * @type {import('express').RequestHandler<{ adviceId: string }, ?, ?>}
 */
export const deleteS51Advice = async ({ params: { adviceId } }, response) => {
	let s51Advice;
	try {
		s51Advice = await s51AdviceRepository.deleteSoftlyById(Number(adviceId));

		// and need to mark any associated documents as deleted too
		// and broadcast delete events for them as well
		if (s51Advice) {
			const attachments = await s51AdviceDocumentRepository.getForAdvice(Number(adviceId));
			const docGuids = attachments.map(({ documentGuid }) => documentGuid);
			for (const guid of docGuids) {
				await deleteDocument(guid, s51Advice.caseId.toString());
			}
		} else {
			response.send(s51Advice);
			return;
		}

		// broadcast s51 advice event
		await broadcastNsipS51AdviceEvent(s51Advice, EventType.Delete);

		response.send(s51Advice);
	} catch (error) {
		throw new BackOfficeAppError(`Unknown error: ${error}`, 400);
	}
};

/**
 * Unpublish S51 advice item
 *
 * @type {import('express').RequestHandler<{adviceId: number}, any, any, any>}
 */
export const unpublishS51Advice = async ({ body, params }, response) => {
	const adviceId = params.adviceId;
	const payload = body[''];

	const updatedS51Advice = await unpublishS51(adviceId);

	const docs = await s51AdviceDocumentRepository.getForAdvice(adviceId);
	// @ts-ignore
	updatedS51Advice.S51AdviceDocument = docs;
	payload.publishedStatusPrev = updatedS51Advice.publishedStatus;

	// broadcast s51 advice event
	await broadcastNsipS51AdviceEvent(updatedS51Advice, EventType.Unpublish);

	response.send(updatedS51Advice);
};
