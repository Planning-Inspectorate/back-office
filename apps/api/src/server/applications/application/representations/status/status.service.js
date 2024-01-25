import * as representationsRepository from '#repositories/representation.repository.js';

export const updateStatusRepresentation = async (repId, action) => {
	const representation = await representationsRepository.getFirstById(repId);

	const previousStatus = representation.status;
	const newStatus = action.status;
	const unpublished = previousStatus === 'PUBLISHED' && newStatus !== 'PUBLISHED';

	return representationsRepository.updateApplicationRepresentationStatusById(
		representation,
		action,
		unpublished
	);
};
