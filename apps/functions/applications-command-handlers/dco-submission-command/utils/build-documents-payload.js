import { mapDCOFolderToCBOSFolder } from './map-dco-folder-to-cbos.js';
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
		throw new Error(`getAcceptanceFolders failed for caseId ${caseId} with error: ${err}`);
	}
};

//get CBOS folder id by DCO folder name
const getCBOSFolderId = (CBOSAcceptanceFolderList, DCOFolderName) => {
	const CBOSFolderName = mapDCOFolderToCBOSFolder(DCOFolderName);

	return CBOSAcceptanceFolderList.find((folder) => folder.displayNameEn === CBOSFolderName).id;
};

export const buildDocumentsPayload = async (documents, caseId) => {
	const applicationDocumentFolderList = await getApplicationDocumentsFolders(caseId);

	return documents.map((document) => {
		//blobStoreUrl: "applications/<case_ref>/compulsory-acquisition-information/funding-statement/file1.pdf"
		const dcoFolderCategory = document.blobStoreUrl.split('/')[2];

		return {
			caseId,
			folderId: getCBOSFolderId(applicationDocumentFolderList, dcoFolderCategory),
			sourceSystem: 'dco-portal',
			username: '???',
			documentName: document.documentName,
			documentSize: Number(document.documentSize),
			documentType: document.documentType,
			blobStoreUrl: `/${document.blobStoreUrl}`
		};
	});
};

const sample = [
	{
		documentName: 'file2.pdf',
		documentSize: '13264',
		documentType: 'application/pdf',
		blobStoreUrl:
			'applications/WW0110046/environmental-statement/environmental-statement-appendices/file2.pdf',
		caseId: '69608b10-5f8c-4aba-8f3c-653736371279',
		folderName: 'Environmental statement',
		documentReference: 'Environmental statement appendices',
		username: 'emil.placheta@planninginspectorate.gov.uk'
	},
	{
		documentName: 'file1.pdf',
		documentSize: '13264',
		documentType: 'application/pdf',
		blobStoreUrl:
			'applications/WW0110046/application-form-related-information/application-cover-letter/file1.pdf',
		caseId: '69608b10-5f8c-4aba-8f3c-653736371279',
		folderName: 'Application form related information',
		documentReference: 'Application cover letter',
		username: 'emil.placheta@planninginspectorate.gov.uk'
	},
	{
		documentName: 'file2.pdf',
		documentSize: '13264',
		documentType: 'application/pdf',
		blobStoreUrl:
			'applications/WW0110046/additional-prescribed-information/offshore-generating-station/file2.pdf',
		caseId: '69608b10-5f8c-4aba-8f3c-653736371279',
		folderName: 'Additional prescribed information',
		documentReference: 'Offshore generating station',
		username: 'emil.placheta@planninginspectorate.gov.uk'
	},
	{
		documentName: 'file2.pdf',
		documentSize: '13264',
		documentType: 'application/pdf',
		blobStoreUrl:
			'applications/WW0110046/reports-and-statements/habitat-regulations-assessment-screening-report/file2.pdf',
		caseId: '69608b10-5f8c-4aba-8f3c-653736371279',
		folderName: 'Reports and statements',
		documentReference: 'Habitat Regulations Assessment (HRA) screening report',
		username: 'emil.placheta@planninginspectorate.gov.uk'
	},
	{
		documentName: 'file1.pdf',
		documentSize: '13264',
		documentType: 'application/pdf',
		blobStoreUrl:
			'applications/WW0110046/plans-and-drawings/plans-of-statutory-and-non-statutory-sites-or-features/file1.pdf',
		caseId: '69608b10-5f8c-4aba-8f3c-653736371279',
		folderName: 'Plans and drawings',
		documentReference:
			'Plans of statutory and non-statutory sites or features (for example, nature conservation, habitats, marine conservation zones, water bodies)',
		username: 'emil.placheta@planninginspectorate.gov.uk'
	},
	{
		documentName: 'file1.pdf',
		documentSize: '13264',
		documentType: 'application/pdf',
		blobStoreUrl: 'applications/WW0110046/draft-dco/draft-development-consent-order/file1.pdf',
		caseId: '69608b10-5f8c-4aba-8f3c-653736371279',
		folderName: 'Draft development consent order (DCO)',
		documentReference: 'Draft development consent order (DCO)',
		username: 'emil.placheta@planninginspectorate.gov.uk'
	},
	{
		documentName: 'file2.pdf',
		documentSize: '13264',
		documentType: 'application/pdf',
		blobStoreUrl:
			'applications/WW0110046/consultation-report/consultation-report-appendices/file2.pdf',
		caseId: '69608b10-5f8c-4aba-8f3c-653736371279',
		folderName: 'Consultation report',
		documentReference: 'Consultation report appendices',
		username: 'emil.placheta@planninginspectorate.gov.uk'
	},
	{
		documentName: 'file2.pdf',
		documentSize: '13264',
		documentType: 'application/pdf',
		blobStoreUrl: 'applications/WW0110046/consultation-report/consultation-report/file2.pdf',
		caseId: '69608b10-5f8c-4aba-8f3c-653736371279',
		folderName: 'Consultation report',
		documentReference: 'Consultation report',
		username: 'emil.placheta@planninginspectorate.gov.uk'
	},
	{
		documentName: 'file2.pdf',
		documentSize: '13264',
		documentType: 'application/pdf',
		blobStoreUrl: 'applications/WW0110046/plans-and-drawings/works-plan/file2.pdf',
		caseId: '69608b10-5f8c-4aba-8f3c-653736371279',
		folderName: 'Plans and drawings',
		documentReference: 'Works plan',
		username: 'emil.placheta@planninginspectorate.gov.uk'
	},
	{
		documentName: 'file2.pdf',
		documentSize: '13264',
		documentType: 'application/pdf',
		blobStoreUrl: 'applications/WW0110046/plans-and-drawings/land-plans/file2.pdf',
		caseId: '69608b10-5f8c-4aba-8f3c-653736371279',
		folderName: 'Plans and drawings',
		documentReference: 'Land plans',
		username: 'emil.placheta@planninginspectorate.gov.uk'
	},
	{
		documentName: 'file1.pdf',
		documentSize: '13264',
		documentType: 'application/pdf',
		blobStoreUrl: 'applications/WW0110046/plans-and-drawings/location-plans/file1.pdf',
		caseId: '69608b10-5f8c-4aba-8f3c-653736371279',
		folderName: 'Plans and drawings',
		documentReference: 'Location plans',
		username: 'emil.placheta@planninginspectorate.gov.uk'
	},
	{
		documentName: 'file2.pdf',
		documentSize: '13264',
		documentType: 'application/pdf',
		blobStoreUrl: 'applications/WW0110046/draft-dco/si-validation-report-success-email/file2.pdf',
		caseId: '69608b10-5f8c-4aba-8f3c-653736371279',
		folderName: 'Draft development consent order (DCO)',
		documentReference: 'Statutory instrument report success email',
		username: 'emil.placheta@planninginspectorate.gov.uk'
	},
	{
		documentName: 'file2.pdf',
		documentSize: '13264',
		documentType: 'application/pdf',
		blobStoreUrl:
			'applications/WW0110046/compulsory-acquisition-information/funding-statement/file2.pdf',
		caseId: '69608b10-5f8c-4aba-8f3c-653736371279',
		folderName: 'Compulsory acquisition information',
		documentReference: 'Funding statement',
		username: 'emil.placheta@planninginspectorate.gov.uk'
	},
	{
		documentName: 'file2.pdf',
		documentSize: '13264',
		documentType: 'application/pdf',
		blobStoreUrl: 'applications/WW0110046/draft-dco/explanatory-memorandum/file2.pdf',
		caseId: '69608b10-5f8c-4aba-8f3c-653736371279',
		folderName: 'Draft development consent order (DCO)',
		documentReference: 'Explanatory memorandum',
		username: 'emil.placheta@planninginspectorate.gov.uk'
	}
];

//getAcceptanceFolders(100000000);

//buildDocumentsPayload(sample, 100000000).then((payload) => console.log('payload', payload));
