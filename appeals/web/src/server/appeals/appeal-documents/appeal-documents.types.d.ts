import { ValidationErrors } from '@pins/express/types/express.js';

export interface DocumentUploadPageParameters {
	backButtonUrl: string;
	appealId: string;
	folderId: string;
	documentId?: string;
	useBlobEmulator: boolean;
	blobStorageHost: string;
	blobStorageContainer: string;
	multiple: boolean;
	documentStage: string;
	serviceName?: string;
	appealShortReference?: string | null | undefined;
	pageTitle?: string;
	pageHeadingText: string;
	caseInfoText?: string;
	documentType: string;
	nextPageUrl: string;
	displayLateEntryContent?: boolean;
	displayCorrectFolderConfirmationContent?: boolean;
	errors: ValidationErrors | undefined;
}
