// @ts-nocheck
// TODO: data and document types schema (PINS data model)
import { databaseConnector } from '#utils/database-connector.js';
import { mapDefaultCaseFolders } from '#endpoints/documents/documents.mapper.js';
import { mapBlobPath } from '#endpoints/documents/documents.mapper.js';
import { getDefaultRedactionStatus } from './document-metadata.repository.js';
import { STATE_TARGET_ASSIGN_CASE_OFFICER } from '#endpoints/constants.js';
import { createAppealReference } from '#utils/appeal-reference.js';

import config from '#config/config.js';

export const loadAppeal = async (id) => {
	const appeal = await databaseConnector.appeal.findUnique({
		where: { id },
		include: getFindUniqueAppealQueryIncludes()
	});

	return appeal;
};

export const createAppeal = async (data, documents) => {
	const unredactedStatus = await getDefaultRedactionStatus();
	const transaction = await databaseConnector.$transaction(async (tx) => {
		let appeal = await tx.appeal.create({ data });
		await tx.folder.createMany({ data: mapDefaultCaseFolders(appeal.id) });

		const reference = createAppealReference(appeal.id).toString();
		appeal = await tx.appeal.update({
			where: { id: appeal.id },
			data: {
				reference,
				appealStatus: {
					create: {
						status: STATE_TARGET_ASSIGN_CASE_OFFICER,
						createdAt: new Date().toISOString()
					}
				}
			}
		});

		let documentVersions = [];

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
					const blobStoragePath = mapBlobPath(document.documentGuid, reference, document.fileName);
					const documentURI = `${config.BO_BLOB_STORAGE_ACCOUNT.replace(/\/$/, '')}/${
						config.BO_BLOB_CONTAINER
					}/${blobStoragePath}`;

					return {
						version: 1,
						...document,
						documentURI,
						blobStoragePath,
						dateReceived: new Date().toISOString(),
						draft: false,
						redactionStatusId: unredactedStatus?.id
					};
				})
			});

			for (const doc of documents) {
				await tx.document.update({
					data: { latestVersionId: 1 },
					where: { guid: doc.documentGuid }
				});
			}

			documentVersions = await tx.documentVersion.findMany({
				where: {
					documentGuid: {
						in: documents.map((d) => d.documentGuid)
					}
				}
			});
		}

		appeal = await tx.appeal.findUnique({
			where: { id: appeal.id },
			include: getFindUniqueAppealQueryIncludes()
		});

		return {
			appeal,
			documentVersions
		};
	});

	return transaction;
};

export const createOrUpdateLpaQuestionnaire = async (
	caseReference,
	nearbyReferences,
	data,
	documents
) => {
	const unredactedStatus = await getDefaultRedactionStatus();
	const transaction = await databaseConnector.$transaction(async (tx) => {
		let appeal = await tx.appeal.findUnique({
			where: { reference: caseReference }
		});

		// const otherAppeals = await tx.appeal.findMany({
		// 	where: { reference: { in: nearbyReferences } }
		// });

		if (appeal) {
			appeal = await tx.appeal.update({
				where: { id: appeal.id },
				data: {
					lpaQuestionnaire: {
						upsert: {
							create: data,
							update: data
						}
					}
					// ,
					// otherAppeals: {
					// 	set: otherAppeals.map((other) => {
					// 		return { id: other.id };
					// 	})
					// }
				}
			});
		}

		let documentVersions = [];

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
					const blobStoragePath = mapBlobPath(
						document.documentGuid,
						appeal.reference,
						document.fileName
					);
					const documentURI = `${config.BO_BLOB_STORAGE_ACCOUNT.replace(/\/$/, '')}/${
						config.BO_BLOB_CONTAINER
					}/${blobStoragePath}`;

					return {
						version: 1,
						...document,
						documentURI,
						blobStoragePath,
						dateReceived: new Date().toISOString(),
						draft: false,
						redactionStatusId: unredactedStatus?.id
					};
				})
			});

			for (const doc of documents) {
				await tx.document.update({
					data: { latestVersionId: 1 },
					where: { guid: doc.documentGuid }
				});
			}

			documentVersions = await tx.documentVersion.findMany({
				where: {
					documentGuid: {
						in: documents.map((d) => d.documentGuid)
					}
				}
			});
		}

		if (appeal) {
			appeal = await tx.appeal.findUnique({
				where: { id: appeal.id },
				include: getFindUniqueAppealQueryIncludes()
			});
		}

		return {
			appeal,
			documentVersions
		};
	});

	return transaction;
};

export const createDocument = async (data) => {
	return data;
};

const getFolderIdFromDocumentType = (caseFolders, documentType, stage) => {
	const catchAllFolder = 'additionalDocuments';

	const caseFolder = caseFolders.find(
		(caseFolder) => caseFolder.path === `${stage}/${documentType}`
	);
	if (caseFolder) {
		return caseFolder.id;
	}

	return caseFolders.find((caseFolder) => caseFolder.path === `${stage}/${catchAllFolder}`);
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
		appellant: true,
		agent: true,
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
