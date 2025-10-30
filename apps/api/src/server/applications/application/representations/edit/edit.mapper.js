import { isEmpty } from 'lodash-es';

export const updateRepEditRequestToRepository = (body) => {
	const representation = {
		editedRepresentation: body.editedRepresentation,
		editNotes: body.editNotes
	};
	const representationAction = {
		type: 'EDIT',
		redactStatus: false,
		actionBy: body.actionBy
	};
	if (body.editNotes !== undefined) {
		representationAction.notes = body.editNotes;
	}

	return {
		...(!isEmpty(representation) && { representation }),
		...(!isEmpty(representationAction) && { representationAction })
	};
};
