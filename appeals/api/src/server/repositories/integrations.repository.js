// @ts-nocheck
import { databaseConnector } from '#utils/database-connector.js';
import { mapDefaultCaseFolders } from '#endpoints/documents/documents.mapper.js';
import config from '#config/config.js';

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
			include: {
				appellantCase: {
					include: {
						appellantCaseValidationOutcome: true
					}
				},
				lpaQuestionnaire: true,
				user: true,
				appellant: true,
				appealTimetable: true
			}
		});

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
	const folderLayout = config.appealFolderLayout;
	let targetFolder = folderLayout.find(
		(folder) => folder.path.indexOf(stage) === 0 && folder.allowedTypes.indexOf(documentType) > -1
	);

	if (!targetFolder) {
		targetFolder = folderLayout.find(
			(folder) => folder.path.indexOf(stage) === 0 && folder.allowedTypes.indexOf('*') === 0
		);
	}

	if (targetFolder) {
		const caseFolder = caseFolders.find((caseFolder) => caseFolder.path === targetFolder.path);
		return caseFolder.id;
	}

	return null;
};
