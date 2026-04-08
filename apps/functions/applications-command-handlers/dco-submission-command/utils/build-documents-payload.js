import { mapDCOCategoryToCBOSFolder } from './map-dco-folder-to-cbos.js';
import api from '../back-office-api-client.js';

//get CBOSs 'Application documents' folder and its child folders by caseId
const getApplicationDocumentsFolders = async (caseId) => {
	//Acceptance->Application documents->[child folders]
	try {
		const allFolders = await api.getAllFoldersOnCase(caseId);

		const acceptanceFolderId = allFolders.find(
			(folder) => folder.parentFolderId === null && folder.displayNameEn === 'Acceptance'
		).id;

		const applicationDocumentsFolderId = allFolders.find(
			(folder) =>
				folder.parentFolderId === acceptanceFolderId &&
				folder.displayNameEn === 'Application documents'
		).id;

		const acceptanceChildFolders = allFolders.filter(
			(folder) => folder.parentFolderId === applicationDocumentsFolderId
		);

		return acceptanceChildFolders;
	} catch (err) {
		throw new Error(
			`getApplicationDocumentsFolders failed for caseId ${caseId} with error: ${err}`
		);
	}
};

//get CBOS folder id by DCO folder category name
const getCBOSFolderId = (CBOSAcceptanceFolderList, DCOFolderName) => {
	const CBOSFolderName = mapDCOCategoryToCBOSFolder(DCOFolderName);

	return CBOSAcceptanceFolderList.find((folder) => folder.displayNameEn === CBOSFolderName).id;
};

export const buildDocumentsPayload = async (documents, caseId) => {
	const applicationDocumentFolderList = await getApplicationDocumentsFolders(caseId);

	return documents.map((document) => {
		const dcoFolderCategory = document.blobStoreUrl.split('/')[2];

		return {
			caseId,
			folderId: getCBOSFolderId(applicationDocumentFolderList, dcoFolderCategory),
			sourceSystem: 'dco-portal',
			username: 'Applicant via DCO Portal',
			documentName: document.documentName,
			documentSize: Number(document.documentSize),
			documentType: document.documentType,
			blobStoreUrl: `/${document.blobStoreUrl}`
		};
	});
};
