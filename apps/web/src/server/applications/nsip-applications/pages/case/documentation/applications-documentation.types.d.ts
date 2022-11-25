import { DocumentationCategory, DocumentationFile } from '../../../applications.types';

export interface DocumentationPageProps {
	subFolders: DocumentationCategory[] | null;
	documentationFiles: DocumentationFile[] | null;
}

export interface CaseDocumentationUploadProps {
	currentFolder: DocumentationCategory;
	caseId: string;
}
