// @ts-nocheck
// TODO: data and document types schema (PINS data model)
import { databaseConnector } from '#utils/database-connector.js';
import { mapDefaultCaseFolders } from '#endpoints/documents/documents.mapper.js';

export const loadAppeal = async (id) => {
	const appeal = await databaseConnector.appeal.findUnique({
		where: { id },
		include: getFindUniqueAppealQueryIncludes()
	});

	return appeal;
};

export const createAppeal = async (data, documents) => {
	const transaction = await databaseConnector.$transaction(async (tx) => {
		let appeal = await tx.appeal.create({ data });
		await tx.folder.createMany({ data: mapDefaultCaseFolders(appeal.id) });

		const ref = createAppealReference(appeal.id);
		appeal = await tx.appeal.update({
			where: { id: appeal.id },
			data: {
				reference: ref.toString(),
				appealStatus: { create: {} }
			}
		});

		if (documents) {
			const caseFolders = await tx.folder.findMany({ where: { caseId: appeal.id } });
			await tx.document.createMany({
				data: documents.map((document) => {
					return {
						guid: document.documentGuid,
						caseId: appeal.id,
						folderId: getFolderIdFromDocumentType(
							caseFolders,
							document.documentType,
							document.stage
						),
						name: document.fileName
					};
				})
			});

			await tx.documentVersion.createMany({
				data: documents.map((document) => {
					return {
						version: 1,
						...document
					};
				})
			});

			for (const doc of documents) {
				await tx.document.update({
					data: { latestVersionId: 1 },
					where: { guid: doc.documentGuid }
				});
			}
		}

		appeal = await tx.appeal.findUnique({
			where: { id: appeal.id },
			include: getFindUniqueAppealQueryIncludes()
		});

		return appeal;
	});

	return transaction;
};

export const createOrUpdateLpaQuestionnaire = async (
	caseReference,
	nearbyReferences,
	data,
	documents
) => {
	const transaction = await databaseConnector.$transaction(async (tx) => {
		let appeal = await tx.appeal.findUnique({
			where: { reference: caseReference }
		});

		const otherAppeals = await tx.appeal.findMany({
			where: { reference: { in: nearbyReferences } }
		});

		if (appeal) {
			appeal = await tx.appeal.update({
				where: { id: appeal.id },
				data: {
					lpaQuestionnaire: {
						upsert: {
							create: data,
							update: data
						}
					},
					otherAppeals: {
						set: otherAppeals.map((other) => {
							return { id: other.id };
						})
					}
				}
			});
		}

		if (appeal && documents) {
			const caseFolders = await tx.folder.findMany({ where: { caseId: appeal.id } });
			await tx.document.createMany({
				data: documents.map((document) => {
					return {
						guid: document.documentGuid,
						caseId: appeal.id,
						folderId: getFolderIdFromDocumentType(
							caseFolders,
							document.documentType,
							document.stage
						),
						name: document.fileName
					};
				})
			});

			await tx.documentVersion.createMany({
				data: documents.map((document) => {
					return {
						version: 1,
						...document
					};
				})
			});

			for (const doc of documents) {
				await tx.document.update({
					data: { latestVersionId: 1 },
					where: { guid: doc.documentGuid }
				});
			}
		}

		if (appeal) {
			appeal = await tx.appeal.findUnique({
				where: { id: appeal.id },
				include: getFindUniqueAppealQueryIncludes()
			});
		}

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

const getFolderIdFromDocumentType = (caseFolders, documentType, stage) => {
	const caseFolder = caseFolders.find(
		(caseFolder) => caseFolder.path === `${stage}/${documentType}`
	);
	if (caseFolder) {
		return caseFolder.id;
	}

	// TODO: Fall back to a 'dropbox' folder?

	return null;
};

const getFindUniqueAppealQueryIncludes = () => {
	return {
		appellantCase: {
			include: {
				appellantCaseValidationOutcome: true
			}
		},
		lpaQuestionnaire: {
			include: {
				lpaQuestionnaireValidationOutcome: true
			}
		},
		appellant: {
			include: {
				customer: {
					include: {
						address: true
					}
				}
			}
		},
		agent: {
			include: {
				customer: {
					include: {
						address: true
					}
				}
			}
		},
		lpa: true,
		inspector: true,
		caseOfficer: true,
		appealTimetable: true,
		address: true,
		appealType: true,
		allocation: true,
		specialisms: {
			include: {
				specialism: true
			}
		}
	};
};
