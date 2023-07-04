import { updateRepStatusRequestToRepository } from './status.mapper.js';
import { updateStatusRepresentation } from './status.service.js';

/**
 *
 * @type {import("express").RequestHandler<{id: number}, ?, import("@pins/applications").PatchRepresentationStatus>}
 */
export const patchRepresentationStatus = async ({ params, body }, response) => {
	const { repId } = params;

	try {
		const mappedRepresentationStatus = updateRepStatusRequestToRepository(body);
		const data = await updateStatusRepresentation(repId, mappedRepresentationStatus);
		return response.send({ repId: repId, status: data?.status });
	} catch (error) {
		return response.status(500).json({
			errors: {
				contact: `Error updating the representation status and creating a representation action`
			}
		});
	}
};
