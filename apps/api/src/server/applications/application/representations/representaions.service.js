import * as representationsRepository from '../../../repositories/representation.repository.js';

/**
 *
 * @param {number} caseId
 * @param {{page: number, pageSize: number}} pagination
 * @param {{searchTerm: string?, filters: Record<string, string[] | boolean>?, sort: object[]?}} filterAndSort
 * @returns {Promise<{ count: number, items: any[]}>}
 */
export const getCaseRepresentations = async (caseId, pagination, filterAndSort) => {
	return representationsRepository.getByCaseId(caseId, pagination, filterAndSort);
};

/**
 *
 * @param {number} caseId
 * @param {number} repId
 * @returns {Promise<object>}
 */
export const getCaseRepresentation = async (caseId, repId) => {
	return representationsRepository.getById(Number(repId), Number(caseId));
};

/**
 *
 * @param {import("../../repositories/representation.repository").CreateRepresentationParams} representation
 * @returns {Promise<object>}
 */
export const createCaseRepresentation = async (representation) => {
	return representationsRepository.createApplicationRepresentation(representation);
};

export const updateCaseRepresentation = async (representation, caseId, representationId) => {
	return representationsRepository.updateApplicationRepresentation(
		representation,
		caseId,
		representationId
	);
};

/**
 *
 * @param {number} caseId
 * @returns {Promise<*>}
 */
export const getCaseRepresentationsStatusCount = async (caseId) => {
	return representationsRepository.getStatusCountByCaseId(caseId);
};
