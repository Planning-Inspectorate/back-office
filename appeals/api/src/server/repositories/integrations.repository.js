// @ts-nocheck
import { databaseConnector } from '#utils/database-connector.js';
import { mapDefaultCaseFolders } from '#endpoints/documents/documents.mapper.js';

export const createAppeal = async (data) => {
	const transaction = await databaseConnector.$transaction(async (tx) => {
		// Create service users
		// ...

		// Create appeal
		let appeal = await tx.appeal.create({ data });
		if (!data.reference) {
			const ref = createAppealReference(appeal.id);
			appeal = await tx.appeal.update({
				where: { id: appeal.id },
				data: { reference: ref.toString() }
			});
		}

		// Create folders
		await tx.folder.createMany({ data: mapDefaultCaseFolders(appeal.id) });

		// Organise documents
		// ...

		// Save documents
		// ...

		return appeal;
	});

	return transaction;
};

export const createDocument = async (data) => {
	return data;
};

const createAppealReference = (/** @type {number} */ id) => {
	const minref = 6000000;
	return (minref + id).toString();
};
