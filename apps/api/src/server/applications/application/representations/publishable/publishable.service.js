import * as representationsRepository from '#repositories/representation.repository.js';

export const getPublishableCaseRepresentations = async (caseId) =>
	representationsRepository.getPublishableRepresentations(caseId);

export const isRepresentationsPreviouslyPublished = async (caseId) =>
	representationsRepository.isRepresentationsPreviouslyPublished(caseId);
