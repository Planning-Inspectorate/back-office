import { deleteContactRepresentation } from './contacts.service.js';
import { Prisma } from '@prisma/client';

/**
 *
 * @type {import("express").RequestHandler<{id: number}, ?, import("@pins/applications").CreateUpdateRepresentation>}
 */
export const deleteRepresentationContact = async ({ params }, response) => {
	const { repId, contactId } = params;
	try {
		await deleteContactRepresentation(Number(repId), Number(contactId));
		return response.send({ contactId });
	} catch (e) {
		if (e instanceof Prisma.PrismaClientKnownRequestError) {
			return response.status(404).json({ errors: { contact: `resource not found` } });
		}
		return response
			.status(500)
			.json({ errors: { contact: `Error deleting contact from representation` } });
	}
};
