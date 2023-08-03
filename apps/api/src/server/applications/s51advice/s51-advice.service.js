import * as s51AdviceRepository from '../../repositories/s51-advice.repository.js';
import { getPageCount, getSkipValue } from '../../utils/database-pagination.js';
import { mapManyS51Advice } from '../../utils/mapping/map-s51-advice-details.js';
import { getCaseDetails } from '../application/application.service.js';

/**
 * @typedef {import('@pins/applications').FolderDetails} FolderDetails
 * @typedef {import('@pins/applications').S51AdviceDetails} S51AdviceDetails
 * @typedef {{ page: number, pageDefaultSize: number, pageCount: number, itemCount: number, items: S51AdviceDetails[]}} S51AdvicePaginatedDetails

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
