import { isEmpty, pick } from 'lodash-es';

export const updateRepRedactRequestToRepository = (body) => {
	const representation = pick(body, ['redactedRepresentation', 'redacted']);
	const representationAction = pick(body, ['type', 'notes', 'actionBy', 'redactStatus']);

	if ('redactStatus' in representationAction) {
		if (!representationAction.type) representationAction.type = 'REDACT_STATUS';
		representation.redacted = representationAction.redactStatus;
	} else {
		if (!representationAction.type) representationAction.type = 'REDACTION';
		if (!representationAction.redactStatus) representationAction.redactStatus = true;
		if (!representation.redacted) representation.redacted = true;
	}

	return {
		...(!isEmpty(representation) && { representation }),
		...(!isEmpty(representationAction) && { representationAction })
	};
};
