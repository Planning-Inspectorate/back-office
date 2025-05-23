import * as caseRepository from '#repositories/case.repository.js';
import * as s51AdviceRepository from '#repositories/s51-advice.repository.js';
import * as s51AdviceDocumentRepository from '#repositories/s51-advice-document.repository.js';
import { getPageCount, getSkipValue } from '#utils/database-pagination.js';
import { mapManyS51Advice } from '#utils/mapping/map-s51-advice-details.js';
import { getStorageLocation } from '#utils/document-storage.js';
import { getCaseDetails } from '../application/application.service.js';
import BackOfficeAppError from '#utils/app-error.js';
import logger from '#utils/logger.js';
import { publishDocuments, unpublishDocuments } from '../application/documents/document.service.js';
import {
	verifyAllS51AdviceHasRequiredPropertiesForPublishing,
	verifyAllS51DocumentsAreVirusChecked,
	hasPublishedAdvice,
	hasPublishedDocument
} from './s51-advice.validators.js';

/**
 * @typedef {import('@pins/applications').FolderDetails} FolderDetails
 * @typedef {import('@pins/applications').S51AdviceDetails} S51AdviceDetails
 * @typedef {import('@pins/applications.api').Schema.S51Advice} S51Advice
 * @typedef {import('@pins/applications.api').Schema.S51AdviceDocument} S51AdviceDocument
 * @typedef {import('@prisma/client').Prisma.S51AdviceGetPayload<{include: {S51AdviceDocument: true}}>} S51AdviceWithS51AdviceDocuments
 * @typedef {import('@pins/applications.api').Api.DocumentAndBlobInfoManyResponse} DocumentAndBlobInfoManyResponse
 * @typedef {{ page: number, pageDefaultSize: number, pageCount: number, itemCount: number, items: S51AdviceDetails[]}} S51AdvicePaginatedDetails
 */

/**
 * Returns paginated array of S51 Advice records on a case
 *
 * @param {number} caseId
 * @param {number} pageNumber
 * @param {number} pageSize
 * @returns {Promise<S51AdvicePaginatedDetails>}
 */
export const getManyS51AdviceOnCase = async (caseId, pageNumber = 1, pageSize = 50) => {
	const skipValue = getSkipValue(pageNumber, pageSize);
	const s51AdviceCount = await s51AdviceRepository.getS51AdviceCountOnCase(caseId, false);
	const s51advices = await s51AdviceRepository.getManyS51AdviceOnCase({
		caseId,
		skipValue,
		pageSize
	});

	//get the case Reference name - needed for the formatted advice ReferenceNumbers
	const caseDetails = await getCaseDetails(caseId, {});
	// @ts-ignore
	const caseRef = caseDetails.reference;

	return {
		page: pageNumber,
		pageDefaultSize: pageSize,
		pageCount: getPageCount(s51AdviceCount, pageSize),
		itemCount: s51AdviceCount,
		items: mapManyS51Advice(caseRef, s51advices)
	};
};

/**
 * Returns array of documents associated with S51 advice
 *
 * @param {number} caseId
 * @param {number} adviceId
 * @returns {Promise<DocumentAndBlobInfoManyResponse>}
 * */
export const getS51AdviceDocuments = async (caseId, adviceId) => {
	const adviceDocumentItems = await s51AdviceDocumentRepository.getForAdvice(adviceId);

	const caseData = await caseRepository.getById(caseId, {});
	if (!caseData?.reference) {
		throw new BackOfficeAppError(`case with ID ${caseId} not found`, 404);
	}

	const blobStorageRequest = adviceDocumentItems.flatMap((item) => {
		if (!(item.documentGuid && caseData.reference)) {
			return [];
		}

		return /** @type {DocumentBlobStoragePayload} */ {
			/** @type {'appeal' | 'application'} */ caseType: 'application',
			caseReference: caseData.reference,
			GUID: item.documentGuid,
			documentName: item.Document?.latestDocumentVersion?.fileName,
			version: 1
		};
	});

	const blobResponse = await getStorageLocation(blobStorageRequest);

	return blobResponse;
};

/**
 *
 * @param {string} id
 * @param {string} status
 * @param {string} redactedStatus
 * @returns {Record<string, any>} An object containing the formatted id, and status and redactedStatus.
 */
export const formatS51AdviceUpdateResponseBody = (id, status, redactedStatus) => {
	return { id, status, redactedStatus };
};

/**
 * Given a list of file names, return three lists: one of pre-existing files with that name in the S51 case, one of pre-existing file that has been deleted, and one with the remainder
 *
 * @typedef {{ duplicates: string[], deleted: string[], remainder: string[] }} ExtractedDuplicates
 * @param {number} adviceId
 * @param {string[]} fileNames
 * @returns {Promise<ExtractedDuplicates>}
 * */
export const extractDuplicatesAndDeleted = async (adviceId, fileNames) => {
	const results = await Promise.allSettled(
		fileNames.map(
			(name) =>
				new Promise((resolve, reject) =>
					s51AdviceDocumentRepository.getDocumentInAdviceByName(adviceId, name).then((existing) => {
						if (existing) {
							reject({ name, isDeleted: existing.isDeleted });
						} else {
							resolve(name);
						}
					})
				)
		)
	);

	return results.reduce((acc, result) => {
		if (result.status === 'fulfilled') {
			acc.remainder.push(result.value);
		} else if (result.reason.isDeleted) {
			acc.deleted.push(result.reason.name);
		} else {
			acc.duplicates.push(result.reason.name);
		}

		return acc;
	}, /** @type {ExtractedDuplicates} */ ({ duplicates: [], deleted: [], remainder: [] }));
};

/**
 * Publish S51 advice and any associated documents
 *
 * @param {number} id
 * @returns {Promise<S51Advice>}
 * @throws {Error}
 * */
export const publishS51 = async (id) => {
	const advice = await s51AdviceRepository.get(id);
	if (!advice) {
		throw new Error(`no advice found with id ${id}`);
	}

	if (advice.publishedStatus === 'published') {
		throw new Error(`advice with id ${id} is already published`);
	}

	const publishedAdvice = await s51AdviceRepository.update(id, {
		publishedStatus: 'published',
		publishedStatusPrev: advice.publishedStatus,
		datePublished: new Date()
	});

	// if there are associated S51 Advice documents, publish them too
	if (advice.S51AdviceDocument.length > 0) {
		const docsToPublish = advice.S51AdviceDocument.map(
			(/** @type {S51AdviceDocument} */ advice) => advice.documentGuid
		);

		await publishDocuments(docsToPublish, 'System', true);
	}

	return publishedAdvice;
};

/**
 * Publish a set of S51 items given their IDs, and any associated documents
 *
 * @param {number[]} ids
 * @returns {Promise<{ fulfilled: S51Advice[], errors: string[] }>}
 * */
export const publishS51Items = async (ids) => {
	const results = await Promise.allSettled(ids.map(publishS51));

	return results.reduce((acc, result) => {
		switch (result.status) {
			case 'fulfilled':
				acc.fulfilled.push(result.value);
				break;
			case 'rejected':
				acc.errors.push(result.reason);
				break;
		}

		return acc;
	}, /** @type {{fulfilled: S51Advice[], errors: string[]}} */ ({ fulfilled: [], errors: [] }));
};

/**
 * Unpublish S51 advice item and associated documents
 *
 * @param {number} id
 * @returns {Promise<S51AdviceWithS51AdviceDocuments>}
 * */
export const unpublishS51 = async (id) => {
	const advice = await s51AdviceRepository.get(id);
	if (!advice) {
		throw new BackOfficeAppError(`no S51 advice found with id ${id}`, 404);
	}

	const updateResponseInTable = await s51AdviceRepository.update(id, {
		publishedStatus: 'not_checked',
		publishedStatusPrev: advice.publishedStatus
	});

	if (advice.S51AdviceDocument.length > 0) {
		const docs = advice.S51AdviceDocument.map(
			(/** @type {S51AdviceDocument} */ advice) => advice.documentGuid
		);

		await unpublishDocuments(docs);
	}

	return updateResponseInTable;
};

/**
@param {number} adviceId
@param {boolean} caseIsWelsh
 * */
export const checkCanPublish = async (adviceId, caseIsWelsh) => {
	const err = await verifyAllS51AdviceHasRequiredPropertiesForPublishing([adviceId], caseIsWelsh);
	if (err) {
		logger.info(`received error from verifyAllS51AdviceHasRequiredPropertiesForPublishing: ${err}`);
		throw new BackOfficeAppError('Enter missing information about the S51 advice', 400);
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
};

/**
 * @param {number} adviceId
 * */
export const performStatusChangeChecks = async (adviceId) => {
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
};
