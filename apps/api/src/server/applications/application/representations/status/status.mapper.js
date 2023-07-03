import { pick } from 'lodash-es';

export const updateRepStatusRequestToRepository = (body) => {
	return {
		...pick(body, ['status', 'notes', 'invalidReason', 'referredTo']),
		actionBy: body.updatedBy,
		type: 'STATUS'
	};
};
