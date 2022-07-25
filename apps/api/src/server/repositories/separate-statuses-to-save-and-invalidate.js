import { filter, includes, isString, map } from 'lodash-es';

export const separateStatusesToSaveAndInvalidate = (newStatuses, currentStatuses) => {
	if (isString(newStatuses) || isString(currentStatuses)) {
		const appealStateIdsToInvalidate = map(currentStatuses, 'id');

		return {
			appealStatesToInvalidate: appealStateIdsToInvalidate,
			appealStatesToCreate: newStatuses
		};
	}

	const newStates = map(newStatuses, 'status');
	const oldStates = map(currentStatuses, 'status');
	const caseStatesToInvalidate = map(
		filter(currentStatuses, (currentState) => {
			return !includes(newStates, currentState.status);
		}),
		'id'
	);
	const caseStatesToCreate = filter(newStatuses, (newStatus) => {
		return !includes(oldStates, newStatus.status);
	});

	return {
		caseStatesToInvalidate,
		caseStatesToCreate
	};
};
