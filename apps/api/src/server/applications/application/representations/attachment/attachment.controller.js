import { addAttachmentRepresentation } from './attachment.service.js';
import { Prisma } from '@prisma/client';

const prismaUniqueConstraintFailedCode = 'P2002';
/**
 *
 * @type {import("express").RequestHandler<{id: number}, ?, import("@pins/applications").AddRepresentationAttachment>}
 */
export const addRepresentationAttachment = async ({ params, body }, response) => {
	const { repId } = params;
	const { documentId } = body;

	try {
		const { id: attachmentId } = await addAttachmentRepresentation(Number(repId), documentId);
		return response.send({ attachmentId });
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			if (error.code === prismaUniqueConstraintFailedCode) {
				return response
					.status(409)
					.json({ errors: { attachment: 'Attachment with document id already exists' } });
			}
			return response.status(404).json({ errors: { documentId: `Must be an existing document` } });
		}
		return response
			.status(500)
			.json({ errors: { contact: `Error creating attachment for representation document` } });
	}
};
