import { isEmpty, pick } from 'lodash-es';

export const updateRepRedactRequestToRepository = (body) => {
	const representation = pick(body, ['redactedRepresentation', 'redacted']);
	const representationAction = pick(body, ['type', 'invalidReason', 'notes', 'actionBy']);

	if (!representationAction.type) representationAction.type = 'REDACTION';
	if (!representationAction.redactStatus) representationAction.redactStatus = true;
	if (!representation.redacted) representation.redacted = true;

	return {
		...(!isEmpty(representation) && { representation }),
		...(!isEmpty(representationAction) && { representationAction })
	};
};
