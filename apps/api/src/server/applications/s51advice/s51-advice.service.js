import * as caseRepository from '../../repositories/case.repository.js';
import * as s51AdviceRepository from '../../repositories/s51-advice.repository.js';
import * as s51AdviceDocumentRepository from '../../repositories/s51-advice-document.repository.js';
import { getPageCount, getSkipValue } from '../../utils/database-pagination.js';
import { mapManyS51Advice } from '../../utils/mapping/map-s51-advice-details.js';
import { getStorageLocation } from '../../utils/document-storage-api-client.js';
import { getCaseDetails } from '../application/application.service.js';
import BackOfficeAppError from '../../utils/app-error.js';

/**
 * @typedef {import('@pins/applications').FolderDetails} FolderDetails
 * @typedef {import('@pins/applications').S51AdviceDetails} S51AdviceDetails
 * @typedef {{ page: number, pageDefaultSize: number, pageCount: number, itemCount: number, items: S51AdviceDetails[]}} S51AdvicePaginatedDetails
 * @typedef {{ caseType: string, caseReference: string, GUID: string }} BlobStoreRequest

 * S51AdvicePaginatedDetails
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
	const s51AdviceCount = await s51AdviceRepository.getS51AdviceCountOnCase(caseId);
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
 * @returns {Promise<{blobStorageHost: string, privateBlobContainer: string, documents: {blobStoreUrl: string, caseType: string, caseReference: string,documentName: string, GUID: string}[]}>}
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

		return {
			caseType: 'application',
			caseReference: caseData.reference,
			GUID: item.documentGuid,
			documentName: item.Document.latestDocumentVersion.fileName
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
 * Given a list of file names, return two lists: one of pre-existing files with that name in the S51 case and another with the remainder
 *
 * @typedef {{ duplicates: string[], remainder: string[] }} ExtractedDuplicates
 * @param {number} adviceId
 * @param {string[]} fileNames
 * @returns {Promise<ExtractedDuplicates>}
 * */
export const extractDuplicates = async (adviceId, fileNames) => {
	const results = await Promise.allSettled(
		fileNames.map(
			(name) =>
				new Promise((resolve, reject) =>
					s51AdviceDocumentRepository.getDocumentInAdviceByName(adviceId, name).then((existing) => {
						if (existing) {
							reject(name);
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
		} else {
			acc.duplicates.push(result.reason);
		}

		return acc;
	}, /** @type {ExtractedDuplicates} */ ({ duplicates: [], remainder: [] }));
};
